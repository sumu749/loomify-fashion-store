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

        const items = body.items;

        if (!code) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Coupon code is required.",
                },
                { status: 400 },
            );
        }

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Your cart is empty.",
                },
                { status: 400 },
            );
        }

        for (const item of items) {
            if (
                !item ||
                typeof item.productId !== "string" ||
                !item.productId ||
                typeof item.variantId !== "string" ||
                !item.variantId ||
                !Number.isInteger(item.quantity) ||
                item.quantity <= 0
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid cart item.",
                    },
                    { status: 400 },
                );
            }
        }

        const uniqueVariantIds = new Set(items.map((item) => item.variantId));

        if (uniqueVariantIds.size !== items.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Duplicate cart variants are not allowed.",
                },
                { status: 400 },
            );
        }

        const coupon = await prisma.coupon.findUnique({
            where: {
                code,
            },
        });

        const variants = await prisma.productVariant.findMany({
            where: {
                id: {
                    in: items.map((item) => item.variantId),
                },
            },
            include: {
                product: {
                    select: {
                        id: true,
                        price: true,
                        published: true,
                    },
                },
            },
        });

        if (variants.length !== items.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: "One or more selected variants no longer exist.",
                },
                { status: 400 },
            );
        }

        let subtotal = 0;

        for (const item of items) {
            const variant = variants.find(
                (currentVariant) => currentVariant.id === item.variantId,
            );

            if (!variant) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Selected variant not found.",
                    },
                    { status: 400 },
                );
            }

            if (variant.product.id !== item.productId) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid product variant relationship.",
                    },
                    { status: 400 },
                );
            }

            if (!variant.product.published) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "One or more products are no longer available.",
                    },
                    { status: 400 },
                );
            }

            const price =
                variant.price !== null
                    ? Number(variant.price)
                    : Number(variant.product.price);

            subtotal += price * item.quantity;
        }

        if (subtotal <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid order subtotal.",
                },
                { status: 400 },
            );
        }

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
