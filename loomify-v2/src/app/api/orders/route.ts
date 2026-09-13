import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 15;

interface CartItemInput {
    productId: string;
    variantId: string;
    quantity: number;
}

interface ShippingAddress {
    [key: string]: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
}

class OrderValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OrderValidationError";
    }
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
            paymentMethod,
            couponCode,
        }: {
            items: CartItemInput[];
            shippingAddress: ShippingAddress;
            paymentMethod: "COD";
            couponCode?: string;
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

        if (paymentMethod !== "COD") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid payment method.",
                },
                { status: 400 },
            );
        }

        if (
            !shippingAddress?.fullName?.trim() ||
            !shippingAddress?.phone?.trim() ||
            !shippingAddress?.address?.trim() ||
            !shippingAddress?.city?.trim() ||
            !shippingAddress?.district?.trim() ||
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

        const normalizedPhone = shippingAddress.phone.replace(/\s+/g, "");
        const normalizedPostalCode = shippingAddress.postalCode.trim();

        if (!/^01\d{9}$/.test(normalizedPhone)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please enter a valid Bangladesh phone number.",
                },
                { status: 400 },
            );
        }

        if (!/^\d{4}$/.test(normalizedPostalCode)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please enter a valid 4-digit postal code.",
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
                throw new OrderValidationError("Selected variant not found.");
            }

            if (variant.product.id !== item.productId) {
                throw new OrderValidationError(
                    "Invalid product variant relationship.",
                );
            }

            if (!variant.product.published) {
                throw new OrderValidationError(
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

        const shippingCost =
            subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

        /*
         * Everything below happens in one transaction.
         */
        const order = await prisma.$transaction(async (tx) => {
            let discount = 0;
            let appliedCouponCode: string | null = null;
            let couponId: string | null = null;
            let couponUsedCount: number | null = null;

            if (couponCode?.trim()) {
                const normalizedCouponCode = couponCode.trim().toUpperCase();

                const coupon = await tx.coupon.findUnique({
                    where: {
                        code: normalizedCouponCode,
                    },
                });

                if (!coupon) {
                    throw new Error("Invalid coupon code.");
                }

                if (!coupon.active) {
                    throw new Error("This coupon is no longer active.");
                }

                if (coupon.expiresAt && coupon.expiresAt <= new Date()) {
                    throw new Error("This coupon has expired.");
                }

                if (
                    coupon.usageLimit !== null &&
                    coupon.usedCount >= coupon.usageLimit
                ) {
                    throw new Error("This coupon has reached its usage limit.");
                }

                couponUsedCount = coupon.usedCount;

                if (
                    coupon.minOrderAmount !== null &&
                    subtotal < Number(coupon.minOrderAmount)
                ) {
                    throw new Error(
                        `Minimum order amount for this coupon is ${Number(
                            coupon.minOrderAmount,
                        ).toFixed(2)}.`,
                    );
                }

                let calculatedDiscount = 0;

                if (coupon.type === "PERCENTAGE") {
                    calculatedDiscount =
                        subtotal * (Number(coupon.value) / 100);
                }

                if (coupon.type === "FIXED") {
                    calculatedDiscount = Number(coupon.value);
                }

                if (
                    coupon.maxDiscount !== null &&
                    calculatedDiscount > Number(coupon.maxDiscount)
                ) {
                    calculatedDiscount = Number(coupon.maxDiscount);
                }

                discount = Math.min(calculatedDiscount, subtotal);
                appliedCouponCode = coupon.code;
                couponId = coupon.id;
            }

            const total = subtotal + shippingCost - discount;

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
                    couponCode: appliedCouponCode,
                    shippingAddress: {
                        ...shippingAddress,
                        phone: normalizedPhone,
                        postalCode: normalizedPostalCode,
                    },
                },
            });

            // Create a payment record for the order with the selected payment method.

            await tx.payment.create({
                data: {
                    orderId: createdOrder.id,
                    provider: "COD",
                    amount: total,
                    currency: "BDT",
                    status: "PENDING",
                },
            });

            if (couponId && couponUsedCount !== null) {
                const updatedCoupon = await tx.coupon.updateMany({
                    where: {
                        id: couponId,
                        usedCount: couponUsedCount,
                    },
                    data: {
                        usedCount: {
                            increment: 1,
                        },
                    },
                });

                if (updatedCoupon.count !== 1) {
                    throw new Error("This coupon has reached its usage limit.");
                }
            }

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

            return {
                order: createdOrder,
                discount,
                total,
            };
        });

        return NextResponse.json(
            {
                success: true,
                message: "Order created successfully.",
                data: {
                    orderId: order.order.id,
                    subtotal,
                    shippingCost,
                    discount: order.discount,
                    total: order.total,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Failed to create order:", error);

        if (error instanceof OrderValidationError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: 400 },
            );
        }

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
