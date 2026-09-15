import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

class OrderCancellationConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OrderCancellationConflictError";
    }
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
                couponUsage: {
                    select: {
                        couponId: true,
                    },
                },
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
            throw new OrderCancellationConflictError(
                "This order can no longer be cancelled.",
            );
        }

        const cancelledOrder = await prisma.$transaction(async (tx) => {
            const updatedOrder = await tx.order.updateMany({
                where: {
                    id: order.id,
                    userId: session.user.id,
                    status: "PENDING",
                },
                data: {
                    status: "CANCELLED",
                },
            });

            if (updatedOrder.count !== 1) {
                throw new OrderCancellationConflictError(
                    "This order can no longer be cancelled.",
                );
            }

            if (order.couponUsage) {
                const updatedCoupon = await tx.coupon.updateMany({
                    where: {
                        id: order.couponUsage.couponId,
                        usedCount: {
                            gt: 0,
                        },
                    },
                    data: {
                        usedCount: {
                            decrement: 1,
                        },
                    },
                });

                if (updatedCoupon.count !== 1) {
                    throw new OrderCancellationConflictError(
                        "Unable to restore coupon usage.",
                    );
                }

                await tx.couponUsage.delete({
                    where: {
                        orderId: order.id,
                    },
                });
            }

            await tx.payment.updateMany({
                where: {
                    orderId: order.id,
                    status: "PENDING",
                },
                data: {
                    status: "CANCELLED",
                },
            });

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

            return tx.order.findUniqueOrThrow({
                where: {
                    id: order.id,
                },
            });
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
        if (error instanceof OrderCancellationConflictError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: 409 },
            );
        }

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
