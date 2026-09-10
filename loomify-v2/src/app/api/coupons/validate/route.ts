import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
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

        const body = await request.json();
        const code =
            typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
        const subtotal = Number(body.subtotal);

        if (!code) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Coupon code is required.",
                },
                { status: 400 },
            );
        }

        if (!Number.isFinite(subtotal) || subtotal <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid order subtotal.",
                },
                { status: 400 },
            );
        }

        const coupon = await prisma.coupon.findUnique({
            where: {
                code,
            },
        });

        if (!coupon) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid coupon code.",
                },
                { status: 404 },
            );
        }

        if (!coupon.active) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This coupon is no longer active.",
                },
                { status: 400 },
            );
        }

        if (coupon.expiresAt && coupon.expiresAt <= new Date()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This coupon has expired.",
                },
                { status: 400 },
            );
        }

        if (
            coupon.usageLimit !== null &&
            coupon.usedCount >= coupon.usageLimit
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This coupon has reached its usage limit.",
                },
                { status: 400 },
            );
        }

        if (
            coupon.minOrderAmount !== null &&
            subtotal < Number(coupon.minOrderAmount)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Minimum order amount is ${Number(
                        coupon.minOrderAmount,
                    ).toFixed(2)}.`,
                },
                { status: 400 },
            );
        }

        let discount = 0;

        if (coupon.type === "PERCENTAGE") {
            discount = subtotal * (Number(coupon.value) / 100);
        }

        if (coupon.type === "FIXED") {
            discount = Number(coupon.value);
        }

        if (
            coupon.maxDiscount !== null &&
            discount > Number(coupon.maxDiscount)
        ) {
            discount = Number(coupon.maxDiscount);
        }

        discount = Math.min(discount, subtotal);

        return NextResponse.json({
            success: true,
            message: "Coupon applied successfully.",
            data: {
                code: coupon.code,
                discount,
            },
        });
    } catch (error) {
        console.error("Failed to validate coupon:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to validate coupon.",
            },
            { status: 500 },
        );
    }
}
