import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

interface OrderRouteParams {
    params: Promise<{
        id: string;
    }>;
}

const validStatuses: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

export async function PATCH(request: Request, { params }: OrderRouteParams) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 },
            );
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden",
                },
                { status: 403 },
            );
        }

        const { id } = await params;

        const body = await request.json();

        const status = body.status as OrderStatus;

        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid order status.",
                },
                { status: 400 },
            );
        }

        const existingOrder = await prisma.order.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                status: true,
            },
        });

        if (!existingOrder) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found.",
                },
                { status: 404 },
            );
        }

        const updatedOrder = await prisma.order.update({
            where: {
                id,
            },
            data: {
                status,
            },
            select: {
                id: true,
                status: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Order status updated successfully.",
            data: updatedOrder,
        });
    } catch (error) {
        console.error("Failed to update order status:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update order status.",
            },
            { status: 500 },
        );
    }
}
