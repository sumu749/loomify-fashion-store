import { NextResponse } from "next/server";

import { cancelPendingPayment } from "@/lib/cancelPendingPayment";
import { prisma } from "@/lib/prisma";
import { validateSslCommerzPayment } from "@/lib/sslcommerz";

interface PaymentMetadata {
    callbackToken?: string;
}

export async function POST(request: Request) {
    const requestUrl = new URL(request.url);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? requestUrl.origin;
    const result = requestUrl.searchParams.get("result");
    const callbackToken = requestUrl.searchParams.get("token");
    const formData = await request.formData();
    const transactionId = String(formData.get("tran_id") ?? "");

    if (!transactionId || !callbackToken) {
        return NextResponse.json(
            { success: false, message: "Invalid payment response." },
            { status: 400 },
        );
    }

    const payment = await prisma.payment.findUnique({
        where: { transactionId },
        include: { order: true },
    });

    if (!payment || payment.provider !== "SSLCOMMERZ") {
        return NextResponse.json(
            { success: false, message: "Payment record not found." },
            { status: 404 },
        );
    }

    const metadata = payment.metadata as PaymentMetadata | null;

    if (metadata?.callbackToken !== callbackToken) {
        return NextResponse.json(
            { success: false, message: "Invalid payment response." },
            { status: 403 },
        );
    }

    if (payment.status === "PAID") {
        return NextResponse.redirect(
            new URL(`/order-success?orderId=${payment.orderId}`, appUrl),
            { status: 303 },
        );
    }

    if (result === "failed" || result === "cancelled") {
        await cancelPendingPayment(
            payment.orderId,
            result === "failed" ? "FAILED" : "CANCELLED",
        );

        return NextResponse.redirect(
            new URL(`/checkout?payment=${result}`, appUrl),
            { status: 303 },
        );
    }

    const validationId = String(formData.get("val_id") ?? "");

    if (!validationId) {
        return NextResponse.json(
            { success: false, message: "Payment validation ID is missing." },
            { status: 400 },
        );
    }

    try {
        const validation = await validateSslCommerzPayment(validationId);
        const amountMatches =
            Math.round(Number(validation.amount) * 100) ===
            Math.round(Number(payment.amount) * 100);

        if (
            !["VALID", "VALIDATED"].includes(validation.status ?? "") ||
            validation.tran_id !== transactionId ||
            validation.currency !== payment.currency ||
            !amountMatches
        ) {
            return NextResponse.json(
                { success: false, message: "Payment could not be verified." },
                { status: 400 },
            );
        }

        await prisma.$transaction(async (tx) => {
            const updatedPayment = await tx.payment.updateMany({
                where: { id: payment.id, status: "PENDING" },
                data: {
                    status: "PAID",
                    paidAt: new Date(),
                    metadata: {
                        callbackToken,
                        validationId,
                        bankTransactionId: validation.bank_tran_id ?? null,
                    },
                },
            });

            if (updatedPayment.count !== 1) {
                const currentPayment = await tx.payment.findUnique({
                    where: { id: payment.id },
                });

                if (currentPayment?.status !== "PAID") {
                    throw new Error(
                        "Payment state changed before confirmation.",
                    );
                }
            }

            await tx.order.updateMany({
                where: { id: payment.orderId, status: "PENDING" },
                data: { status: "CONFIRMED" },
            });
        });

        return NextResponse.redirect(
            new URL(`/order-success?orderId=${payment.orderId}`, appUrl),
            { status: 303 },
        );
    } catch (error) {
        console.error("Failed to validate SSLCommerz payment:", error);

        return NextResponse.json(
            { success: false, message: "Payment verification failed." },
            { status: 502 },
        );
    }
}
