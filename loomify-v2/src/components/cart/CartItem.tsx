"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import formatCurrency from "@/utils/formatCurrency";
import {
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
} from "@/features/cart/cartSlice";
import { useAppDispatch } from "@/store/hooks";

import type { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
    item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
    const dispatch = useAppDispatch();

    const variant = item.variants.find(
        (itemVariant) => itemVariant.id === item.variantId,
    );

    const variantPrice = variant?.price ?? item.price;

    const variantStock = variant?.stock ?? 0;

    const handleDecrease = () => {
        dispatch(
            decreaseQuantity({
                id: item.id,
                variantId: item.variantId,
            }),
        );
    };

    const handleIncrease = () => {
        if (item.quantity >= variantStock) {
            return;
        }

        dispatch(
            increaseQuantity({
                id: item.id,
                variantId: item.variantId,
            }),
        );
    };

    const handleRemove = () => {
        dispatch(
            removeFromCart({
                id: item.id,
                variantId: item.variantId,
            }),
        );
    };

    return (
        <div className="flex flex-col gap-5 rounded-card border border-border p-4 sm:gap-6 sm:p-5 md:flex-row md:items-center">
            {/* Image */}

            <Image
                src={item.image}
                alt={item.name}
                width={112}
                height={144}
                className="h-28 w-24 rounded-lg object-cover sm:h-36 sm:w-28"
            />

            {/* Product Info */}

            <div className="flex-1">
                <p className="text-sm text-gray-500">{item.category}</p>

                <h3 className="mt-1 text-xl font-semibold">{item.name}</h3>

                <p className="mt-2 text-sm">
                    Size: <strong>{variant?.size ?? "N/A"}</strong>
                </p>

                <p className="text-sm">
                    Color: <strong>{variant?.color ?? "N/A"}</strong>
                </p>

                <p className="mt-4 text-xl font-bold">
                    {formatCurrency(variantPrice)}
                </p>

                {variant && (
                    <p className="mt-1 text-xs text-gray-500">
                        {variantStock > 0
                            ? `${variantStock} available`
                            : "Out of stock"}
                    </p>
                )}
            </div>

            {/* Quantity + Remove */}

            <div className="flex items-center justify-between gap-3 self-stretch sm:self-auto md:justify-start">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleDecrease}
                        disabled={item.quantity <= 1}
                        className="rounded-lg border p-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Decrease quantity of ${item.name}`}
                    >
                        <Minus size={18} />
                    </button>

                    <span className="w-8 text-center">{item.quantity}</span>

                    <button
                        type="button"
                        onClick={handleIncrease}
                        disabled={!variant || variantStock <= item.quantity}
                        className="rounded-lg border p-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Increase quantity of ${item.name}`}
                    >
                        <Plus size={18} />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleRemove}
                    className="text-red-500 transition hover:scale-110 md:ml-3"
                    aria-label={`Remove ${item.name} from cart`}
                >
                    <Trash2 size={22} />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
