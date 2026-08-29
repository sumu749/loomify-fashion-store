"use client";

import Link from "next/link";

import Button from "@/components/common/Button";
import { useAppSelector } from "@/store/hooks";
import formatCurrency from "@/utils/formatCurrency";

const CartSummary = () => {
    const cartItems = useAppSelector((state) => state.cart.items);

    const subtotal = cartItems.reduce((total, item) => {
        const variant = item.variants.find(
            (itemVariant) => itemVariant.id === item.variantId,
        );

        const price = variant?.price ?? item.price;

        return total + price * item.quantity;
    }, 0);

    const shipping = subtotal > 100 ? 0 : 15;

    const total = subtotal + shipping;

    return (
        <div className="rounded-card border border-border bg-white p-5 sm:p-6">
            <h2 className="text-xl font-bold sm:text-2xl">Order Summary</h2>

            <div className="mt-8 space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Subtotal</span>

                    <span className="font-medium text-primary">
                        {formatCurrency(subtotal)}
                    </span>
                </div>

                <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Shipping</span>

                    <span className="font-medium text-primary">
                        {shipping === 0 ? "Free" : formatCurrency(shipping)}
                    </span>
                </div>

                <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                            Total
                        </span>

                        <span className="text-xl font-bold text-primary">
                            {formatCurrency(total)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t border-border pt-6">
                <Button asChild size="lg" className="w-full">
                    <Link href="/checkout">Proceed to Checkout</Link>
                </Button>

                <p className="mt-3 text-center text-xs text-gray-500">
                    Secure checkout • Fast & reliable delivery
                </p>
            </div>
        </div>
    );
};

export default CartSummary;
