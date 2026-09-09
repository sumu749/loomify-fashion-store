/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable indent */
"use client";

import { Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";
import { addToCart } from "@/features/cart/cartSlice";
import { toggleWishlist } from "@/features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import type { Product } from "@/types/product";

interface ProductActionsProps {
    product: Product;
}

const ProductActions = ({ product }: ProductActionsProps) => {
    const { sizes, colors, variants } = product;

    const dispatch = useAppDispatch();

    /*
     * Find the first available variant.
     */
    const defaultVariant = useMemo(
        () => variants.find((variant) => variant.stock > 0),
        [variants],
    );

    const [selectedSize, setSelectedSize] = useState(
        defaultVariant?.size ?? sizes[0] ?? "",
    );

    const [selectedColor, setSelectedColor] = useState(
        defaultVariant?.color ?? colors[0] ?? "",
    );

    const [quantity, setQuantity] = useState(1);

    /*
     * Wishlist
     */

    const isInWishlist = useAppSelector((state) =>
        state.wishlist.items.some((item) => item.id === product.id),
    );

    /*
     * Find the currently selected variant.
     */

    const selectedVariant = useMemo(
        () =>
            variants.find(
                (variant) =>
                    variant.size === selectedSize &&
                    variant.color === selectedColor,
            ),
        [variants, selectedSize, selectedColor],
    );

    /*
     * Reset quantity when selected variant changes.
     */

    useEffect(() => {
        setQuantity(1);
    }, [selectedSize, selectedColor]);

    /*
     * Check whether a size has any available variant
     * with the currently selected color.
     */

    const isSizeAvailable = (size: string) => {
        return variants.some(
            (variant) =>
                variant.size === size &&
                variant.color === selectedColor &&
                variant.stock > 0,
        );
    };

    /*
     * Check whether a color has any available variant
     * with the currently selected size.
     */

    const isColorAvailable = (color: string) => {
        return variants.some(
            (variant) =>
                variant.color === color &&
                variant.size === selectedSize &&
                variant.stock > 0,
        );
    };

    /*
     * Find another available color for a selected size.
     */

    const getAvailableColorForSize = (size: string) => {
        return variants.find(
            (variant) => variant.size === size && variant.stock > 0,
        )?.color;
    };

    /*
     * Find another available size for a selected color.
     */

    const getAvailableSizeForColor = (color: string) => {
        return variants.find(
            (variant) => variant.color === color && variant.stock > 0,
        )?.size;
    };

    /*
     * Quantity
     */

    const increaseQuantity = () => {
        if (!selectedVariant) {
            toast.error("Please select an available size and color.");
            return;
        }

        if (quantity >= selectedVariant.stock) {
            toast.error(`Only ${selectedVariant.stock} item(s) available.`);
            return;
        }

        setQuantity((prev) => prev + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    /*
     * Add to cart
     */

    const handleAddToCart = () => {
        if (!selectedVariant) {
            toast.error("Please select an available size and color.");
            return;
        }

        if (selectedVariant.stock <= 0) {
            toast.error("This variant is out of stock.");
            return;
        }

        if (quantity > selectedVariant.stock) {
            toast.error(`Only ${selectedVariant.stock} item(s) available.`);
            return;
        }

        dispatch(
            addToCart({
                product,
                variantId: selectedVariant.id,
                quantity,
            }),
        );

        toast.success("Product added to cart!");
    };

    /*
     * Wishlist
     */

    const handleToggleWishlist = () => {
        dispatch(toggleWishlist(product));

        if (isInWishlist) {
            toast.success("Removed from Wishlist");
        } else {
            toast.success("Added to Wishlist ❤️");
        }
    };

    return (
        <div className="mt-8 space-y-6 sm:space-y-8">
            {/* ================= Size ================= */}

            <div>
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-primary">Select Size</h3>

                    {selectedSize && (
                        <span className="text-xs text-gray-400">
                            Selected: {selectedSize}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => {
                        const available = isSizeAvailable(size);
                        const selected = selectedSize === size;

                        return (
                            <button
                                key={size}
                                type="button"
                                disabled={!available}
                                onClick={() => {
                                    if (!available) {
                                        return;
                                    }

                                    setSelectedSize(size);

                                    /*
                                     * If the current color is not
                                     * available for this size,
                                     * automatically select the
                                     * first available color.
                                     */
                                    if (
                                        !variants.some(
                                            (variant) =>
                                                variant.size === size &&
                                                variant.color ===
                                                    selectedColor &&
                                                variant.stock > 0,
                                        )
                                    ) {
                                        const nextColor =
                                            getAvailableColorForSize(size);

                                        if (nextColor) {
                                            setSelectedColor(nextColor);
                                        }
                                    }
                                }}
                                className={`relative flex h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-sm font-medium transition ${
                                    selected
                                        ? "border-primary bg-primary text-white"
                                        : available
                                          ? "border-border bg-white text-primary hover:border-primary"
                                          : "cursor-not-allowed border-border bg-gray-50 text-gray-300 line-through"
                                }`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ================= Color ================= */}

            <div>
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-primary">Select Color</h3>

                    {selectedColor && (
                        <span className="text-xs text-gray-400">
                            Selected: {selectedColor}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => {
                        const available = isColorAvailable(color);
                        const selected = selectedColor === color;

                        return (
                            <button
                                key={color}
                                type="button"
                                disabled={!available}
                                onClick={() => {
                                    if (!available) {
                                        return;
                                    }

                                    setSelectedColor(color);

                                    /*
                                     * If the current size is not
                                     * available for this color,
                                     * automatically select the
                                     * first available size.
                                     */
                                    if (
                                        !variants.some(
                                            (variant) =>
                                                variant.color === color &&
                                                variant.size === selectedSize &&
                                                variant.stock > 0,
                                        )
                                    ) {
                                        const nextSize =
                                            getAvailableSizeForColor(color);

                                        if (nextSize) {
                                            setSelectedSize(nextSize);
                                        }
                                    }
                                }}
                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                    selected
                                        ? "border-primary bg-primary text-white"
                                        : available
                                          ? "border-border bg-white text-primary hover:border-primary"
                                          : "cursor-not-allowed border-border bg-gray-50 text-gray-300 line-through"
                                }`}
                            >
                                {color}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ================= Selected Variant ================= */}

            <div
                className={`rounded-2xl border p-4 transition ${
                    selectedVariant && selectedVariant.stock > 0
                        ? "border-green-100 bg-green-50/50"
                        : "border-red-100 bg-red-50/50"
                }`}
            >
                {selectedVariant ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-primary">
                                {selectedVariant.size} / {selectedVariant.color}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                SKU: {selectedVariant.sku}
                            </p>
                        </div>

                        <div className="text-sm font-medium">
                            {selectedVariant.stock > 0 ? (
                                <span className="text-green-700">
                                    {selectedVariant.stock} available
                                </span>
                            ) : (
                                <span className="text-red-600">
                                    Out of stock
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm font-medium text-red-600">
                        This size and color combination is not available.
                    </p>
                )}
            </div>

            {/* ================= Quantity ================= */}

            <div>
                <h3 className="mb-3 font-semibold text-primary">Quantity</h3>

                <div className="flex w-fit items-center rounded-xl border border-border">
                    <button
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={!selectedVariant}
                        className="p-3 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Decrease quantity"
                    >
                        <Minus size={18} />
                    </button>

                    <span className="w-12 text-center font-semibold">
                        {quantity}
                    </span>

                    <button
                        type="button"
                        onClick={increaseQuantity}
                        disabled={!selectedVariant}
                        className="p-3 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Increase quantity"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            {/* ================= Buttons ================= */}

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                    onClick={handleAddToCart}
                    className="w-full flex-1 sm:w-auto"
                    disabled={!selectedVariant || selectedVariant.stock <= 0}
                >
                    {!selectedVariant || selectedVariant.stock <= 0
                        ? "Out of Stock"
                        : "Add To Cart"}
                </Button>

                <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label={
                        isInWishlist
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                    className={`flex h-12 w-12 self-start items-center justify-center rounded-xl border transition ${
                        isInWishlist
                            ? "border-accent bg-accent text-white"
                            : "border-border hover:border-primary"
                    }`}
                >
                    <Heart
                        size={20}
                        fill={isInWishlist ? "currentColor" : "none"}
                    />
                </button>
            </div>

            {/* ================= Extra Info ================= */}

            <div className="space-y-2 rounded-2xl bg-stone-50 p-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                    <Truck size={18} className="shrink-0 text-primary" />

                    <span>Free Shipping Worldwide</span>
                </div>

                <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="shrink-0 text-primary" />

                    <span>
                        {selectedVariant
                            ? selectedVariant.stock > 0
                                ? "This variant is in stock"
                                : "This variant is out of stock"
                            : "Select an available size and color"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductActions;
