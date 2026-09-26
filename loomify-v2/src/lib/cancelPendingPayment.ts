import { prisma } from "@/lib/prisma";

type FailedPaymentStatus = "FAILED" | "CANCELLED";

export const cancelPendingPayment = async (
    orderId: string,
    paymentStatus: FailedPaymentStatus,
) => {
    await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: { id: orderId },
            include: {
                items: true,
                payment: true,
                couponUsage: { select: { couponId: true } },
            },
        });

        if (
            !order ||
            order.status !== "PENDING" ||
            order.payment?.status !== "PENDING"
        ) {
            return;
        }

        const cancelledOrder = await tx.order.updateMany({
            where: { id: orderId, status: "PENDING" },
            data: { status: "CANCELLED" },
        });

        const updatedPayment = await tx.payment.updateMany({
            where: { orderId, status: "PENDING" },
            data: { status: paymentStatus },
        });

        if (cancelledOrder.count !== 1 || updatedPayment.count !== 1) {
            throw new Error("Payment state changed before cancellation.");
        }

        for (const item of order.items) {
            await tx.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { increment: item.quantity } },
            });
        }

        if (order.couponUsage) {
            const updatedCoupon = await tx.coupon.updateMany({
                where: {
                    id: order.couponUsage.couponId,
                    usedCount: { gt: 0 },
                },
                data: { usedCount: { decrement: 1 } },
            });

            if (updatedCoupon.count !== 1) {
                throw new Error("Unable to restore coupon usage.");
            }

            await tx.couponUsage.delete({ where: { orderId } });
        }
    });
};
