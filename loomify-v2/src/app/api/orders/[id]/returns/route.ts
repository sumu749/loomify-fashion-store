import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { hashGuestOrderToken } from "@/lib/guestOrderAccess";
import { prisma } from "@/lib/prisma";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

const RETURN_WINDOW_DAYS = 30;
const activeStatuses = [
    "REQUESTED",
    "APPROVED",
    "RECEIVED",
    "COMPLETED",
] as const;

export async function POST(request: Request, { params }: RouteContext) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const { id: orderId } = await params;
        const requestUrl = new URL(request.url);
        const access = requestUrl.searchParams.get("access");

        if (!session && !access) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login or use your private order link.",
                },
                { status: 401 },
            );
        }

        const body = await request.json();
        const orderItemId =
            typeof body?.orderItemId === "string"
                ? body.orderItemId.trim()
                : "";
        const quantity = Number(body?.quantity);
        const reason =
            typeof body?.reason === "string" ? body.reason.trim() : "";
        const resolution = body?.resolution;

        if (
            !orderItemId ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            !reason ||
            reason.length > 1000 ||
            !["REFUND", "EXCHANGE"].includes(resolution)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Enter valid return request details.",
                },
                { status: 400 },
            );
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                status: "DELIVERED",
                ...(session && access
                    ? {
                          OR: [
                              { userId: session.user.id },
                              { guestTokenHash: hashGuestOrderToken(access) },
                          ],
                      }
                    : session
                      ? { userId: session.user.id }
                      : { guestTokenHash: hashGuestOrderToken(access!) }),
            },
            select: {
                id: true,
                updatedAt: true,
                userId: true,
                guestEmail: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only delivered orders can be returned.",
                },
                { status: 400 },
            );
        }

        const returnDeadline = new Date(order.updatedAt);
        returnDeadline.setDate(returnDeadline.getDate() + RETURN_WINDOW_DAYS);

        if (returnDeadline < new Date()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "The 30-day return window has ended.",
                },
                { status: 400 },
            );
        }

        const orderItem = await prisma.orderItem.findFirst({
            where: {
                id: orderItemId,
                orderId: order.id,
            },
            select: {
                id: true,
                quantity: true,
            },
        });

        if (!orderItem) {
            return NextResponse.json(
                {
                    success: false,
                    message: "That item is not part of this order.",
                },
                { status: 404 },
            );
        }

        const previousRequests = await prisma.returnRequest.aggregate({
            where: {
                orderItemId,
                status: { in: [...activeStatuses] },
            },
            _sum: { quantity: true },
        });
        const alreadyRequested = previousRequests._sum.quantity ?? 0;

        if (alreadyRequested + quantity > orderItem.quantity) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Requested quantity exceeds the remaining eligible quantity.",
                },
                { status: 400 },
            );
        }

        const returnRequest = await prisma.returnRequest.create({
            data: {
                userId: session?.user.id,
                guestEmail: session ? null : order.guestEmail,
                orderId: order.id,
                orderItemId: orderItem.id,
                quantity,
                reason,
                requestedResolution: resolution,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Return or exchange request submitted.",
                data: returnRequest,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Failed to create return request:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to submit return request.",
            },
            { status: 500 },
        );
    }
}
