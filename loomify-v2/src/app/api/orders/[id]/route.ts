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
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first.",
                },
                { status: 401 },
            );
        }

        const { id } = await params;

        const order = await prisma.order.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
            include: {
                items: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found.",
                },
                { status: 404 },
            );
        }

        if (order.status !== "PENDING") {
            return NextResponse.json(
                {
                    success: false,
                    message: "This order can no longer be cancelled.",
                },
                { status: 400 },
            );
        }

        const cancelledOrder = await prisma.$transaction(async (tx) => {
            for (const item of order.items) {
                await tx.productVariant.update({
                    where: {
                        id: item.variantId,
                    },
                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                    },
                });
            }

            const updatedOrder = await tx.order.update({
                where: {
                    id: order.id,
                },
                data: {
                    status: "CANCELLED",
                },
            });

            return updatedOrder;
        });

        return NextResponse.json(
            {
                success: true,
                message: "Order cancelled successfully.",
                data: {
                    orderId: cancelledOrder.id,
                    status: cancelledOrder.status,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Failed to cancel order:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to cancel order.",
            },
            { status: 500 },
        );
    }
}
