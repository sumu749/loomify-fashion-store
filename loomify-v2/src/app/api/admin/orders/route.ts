import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface CartItemInput {
    productId: string;
    variantId: string;
    quantity: number;
}

interface ShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login before checkout.",
                },
                { status: 401 },
            );
        }

        const body = await request.json();

        const {
            items,
            shippingAddress,
        }: {
            items: CartItemInput[];
            shippingAddress: ShippingAddress;
        } = body;

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Your cart is empty.",
                },
                { status: 400 },
            );
        }

        if (
            !shippingAddress?.fullName?.trim() ||
            !shippingAddress?.phone?.trim() ||
            !shippingAddress?.address?.trim() ||
            !shippingAddress?.city?.trim() ||
            !shippingAddress?.postalCode?.trim() ||
            !shippingAddress?.country?.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Complete shipping information is required.",
                },
                { status: 400 },
            );
        }

        // Basic item validation
        for (const item of items) {
            if (
                !item.productId ||
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

        // Find selected variants
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
                        name: true,
                        price: true,
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

        // Calculate subtotal from database prices
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

            if (item.quantity > variant.stock) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `${variant.product.name} (${variant.id}) does not have enough stock.`,
                    },
                    { status: 409 },
                );
            }

            const price =
                variant.price !== null
                    ? Number(variant.price)
                    : Number(variant.product.price);

            subtotal += price * item.quantity;
        }

        const shippingCost = subtotal > 100 ? 0 : 15;

        const discount = 0;

        const total = subtotal + shippingCost - discount;

        return NextResponse.json({
            success: true,
            message: "Order information validated successfully.",
            data: {
                subtotal,
                shippingCost,
                discount,
                total,
                shippingAddress,
                itemCount: items.length,
            },
        });
    } catch (error) {
        console.error("Failed to validate order:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to process order.",
            },
            { status: 500 },
        );
    }
}
