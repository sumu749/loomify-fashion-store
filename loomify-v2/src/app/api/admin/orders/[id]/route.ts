import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";

type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

class OrderStatusConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OrderStatusConflictError";
    }
}

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

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING"],
    PROCESSING: ["SHIPPED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
};

export async function PATCH(request: Request, { params }: OrderRouteParams) {
    try {
        const adminCheck = await requireAdmin();

        if (adminCheck.response) {
            return adminCheck.response;
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
            include: {
                items: true,
                couponUsage: {
                    select: {
                        couponId: true,
                    },
                },
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

        if (
            !allowedTransitions[existingOrder.status as OrderStatus].includes(
                status,
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Order cannot be changed from ${existingOrder.status} to ${status}.`,
                },
                { status: 400 },
            );
        }

        const updatedOrder = await prisma.$transaction(async (tx) => {
            if (status === "CANCELLED") {
                const cancelledOrder = await tx.order.updateMany({
                    where: {
                        id,
                        status: existingOrder.status,
                    },
                    data: {
                        status: "CANCELLED",
                    },
                });

                if (cancelledOrder.count !== 1) {
                    throw new OrderStatusConflictError(
                        "The order status changed before cancellation could be completed.",
                    );
                }

                await tx.payment.updateMany({
                    where: {
                        orderId: id,
                        status: "PENDING",
                    },
                    data: {
                        status: "CANCELLED",
                    },
                });

                if (existingOrder.couponUsage) {
                    const updatedCoupon = await tx.coupon.updateMany({
                        where: {
                            id: existingOrder.couponUsage.couponId,
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
                        throw new Error("Unable to restore coupon usage.");
                    }

                    await tx.couponUsage.delete({
                        where: {
                            orderId: id,
                        },
                    });
                }

                for (const item of existingOrder.items) {
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
            } else {
                const updatedOrder = await tx.order.updateMany({
                    where: {
                        id,
                        status: existingOrder.status,
                    },
                    data: {
                        status,
                    },
                });

                if (updatedOrder.count !== 1) {
                    throw new OrderStatusConflictError(
                        "The order status changed before this update could be completed.",
                    );
                }

                if (status === "DELIVERED") {
                    await tx.payment.updateMany({
                        where: {
                            orderId: id,
                            status: "PENDING",
                        },
                        data: {
                            status: "PAID",
                            paidAt: new Date(),
                        },
                    });
                }
            }

            return tx.order.findUniqueOrThrow({
                where: {
                    id,
                },
                select: {
                    id: true,
                    status: true,
                },
            });
        });

        return NextResponse.json({
            success: true,
            message: "Order status updated successfully.",
            data: updatedOrder,
        });
    } catch (error) {
        if (error instanceof OrderStatusConflictError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: 409 },
            );
        }

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
