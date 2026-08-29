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
                    message: "Please login before placing an order.",
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

        /*
         * Prevent the same variant from being submitted
         * multiple times in the same request.
         */
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

        /*
         * Get the actual variants from the database.
         * Client-side price and stock are never trusted.
         */
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

        /*
         * Validate product/variant relationship,
         * publication status and calculate subtotal.
         */
        let subtotal = 0;

        const orderItems = items.map((item) => {
            const variant = variants.find(
                (currentVariant) => currentVariant.id === item.variantId,
            );

            if (!variant) {
                throw new Error("Selected variant not found.");
            }

            if (variant.product.id !== item.productId) {
                throw new Error("Invalid product variant relationship.");
            }

            if (!variant.product.published) {
                throw new Error(
                    `${variant.product.name} is not available for purchase.`,
                );
            }

            const price =
                variant.price !== null
                    ? Number(variant.price)
                    : Number(variant.product.price);

            subtotal += price * item.quantity;

            return {
                item,
                variant,
                price,
            };
        });

        const shippingCost = subtotal > 100 ? 0 : 15;
        const discount = 0;
        const total = subtotal + shippingCost - discount;

        /*
         * Everything below happens in one transaction.
         */
        const order = await prisma.$transaction(async (tx) => {
            /*
             * Re-check and decrement stock atomically.
             */
            for (const { item, variant } of orderItems) {
                const updatedVariant = await tx.productVariant.updateMany({
                    where: {
                        id: variant.id,
                        stock: {
                            gte: item.quantity,
                        },
                    },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });

                if (updatedVariant.count !== 1) {
                    throw new Error(
                        `${variant.product.name} (${variant.size}, ${variant.color}) is out of stock.`,
                    );
                }
            }

            /*
             * Create the order.
             */
            const createdOrder = await tx.order.create({
                data: {
                    userId: session.user.id,
                    status: "PENDING",
                    subtotal,
                    shippingCost,
                    discount,
                    total,
                    couponCode: null,
                    shippingAddress: JSON.parse(
                        JSON.stringify(shippingAddress),
                    ),
                },
            });

            /*
             * Create order items using a snapshot of
             * product + variant information at purchase time.
             */
            await tx.orderItem.createMany({
                data: orderItems.map(({ item, variant, price }) => ({
                    orderId: createdOrder.id,

                    productId: variant.product.id,

                    variantId: variant.id,

                    productName: variant.product.name,

                    variantSku: variant.sku,

                    productPrice: price,

                    quantity: item.quantity,

                    size: variant.size,

                    color: variant.color,
                })),
            });

            return createdOrder;
        });

        return NextResponse.json(
            {
                success: true,
                message: "Order created successfully.",
                data: {
                    orderId: order.id,
                    subtotal,
                    shippingCost,
                    discount,
                    total,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Failed to create order:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to create order.",
            },
            { status: 500 },
        );
    }
}
