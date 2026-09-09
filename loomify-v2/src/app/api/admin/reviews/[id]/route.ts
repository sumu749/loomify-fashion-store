import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
    try {
        // Check authentication
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

        // Check admin role
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

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Review ID is required",
                },
                { status: 400 },
            );
        }

        const review = await prisma.review.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
            },
        });

        if (!review) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Review not found",
                },
                { status: 404 },
            );
        }

        const body = await request.json();

        const { approved } = body as {
            approved?: boolean;
        };

        if (typeof approved !== "boolean") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Approved must be a boolean",
                },
                { status: 400 },
            );
        }

        const updatedReview = await prisma.review.update({
            where: {
                id,
            },
            data: {
                approved,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: approved
                    ? "Review approved successfully"
                    : "Review rejected successfully",
                data: updatedReview,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Failed to update review:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update review",
            },
            { status: 500 },
        );
    }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    try {
        // Check authentication
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

        // Check admin role
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

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Review ID is required",
                },
                { status: 400 },
            );
        }

        const review = await prisma.review.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
            },
        });

        if (!review) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Review not found",
                },
                { status: 404 },
            );
        }

        await prisma.review.delete({
            where: {
                id,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Review deleted successfully",
                data: {
                    id,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Failed to delete review:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete review",
            },
            { status: 500 },
        );
    }
}
