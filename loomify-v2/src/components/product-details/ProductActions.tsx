"use client";

import { Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";
import type { Product } from "@/types/product";
import { addToCart } from "@/features/cart/cartSlice";
import { toggleWishlist } from "@/features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
interface ProductActionsProps {
    product: Product;
}

const ProductActions = ({ product }: ProductActionsProps) => {
    const { sizes, colors, inStock } = product;

    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [quantity, setQuantity] = useState(1);
    const [liked, setLiked] = useState(false);

    const dispatch = useAppDispatch();

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                product,
                quantity,
                size: selectedSize,
                color: selectedColor,
            }),
        );

        toast.success("Product added to cart!");
    };

    const isInWishlist = useAppSelector((state) =>
        state.wishlist.items.some((item) => item.id === product.id),
    );

    const increase = () => {
        setQuantity((prev) => prev + 1);
    };

    const decrease = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    return (
        <div className="mt-8 space-y-6 sm:space-y-8">
            {/* Size */}
            <div>
                <h3 className="mb-3 font-semibold text-primary">Select Size</h3>

                <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`h-10 w-10 rounded-lg border transition sm:h-11 sm:w-11 ${
                                selectedSize === size
                                    ? "border-primary bg-primary text-white"
                                    : "border-border hover:border-primary"
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color */}
            <div>
                <h3 className="mb-3 font-semibold text-primary">
                    Select Color
                </h3>

                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setSelectedColor(color)}
                            className={`rounded-full border px-3 py-2 transition ${
                                selectedColor === color
                                    ? "border-primary bg-primary text-white"
                                    : "border-border hover:border-primary"
                            }`}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quantity */}
            <div>
                <h3 className="mb-3 font-semibold text-primary">Quantity</h3>

                <div className="flex w-full items-center rounded-lg border border-border sm:w-fit">
                    <button
                        type="button"
                        onClick={decrease}
                        className="p-3 hover:bg-gray-100"
                        aria-label="Decrease quantity"
                    >
                        <Minus size={18} />
                    </button>

                    <span className="w-12 text-center font-semibold">
                        {quantity}
                    </span>

                    <button
                        type="button"
                        onClick={increase}
                        className="p-3 hover:bg-gray-100"
                        aria-label="Increase quantity"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                    onClick={handleAddToCart}
                    className="w-full flex-1 sm:w-auto"
                    disabled={!inStock}
                >
                    {inStock ? "Add To Cart" : "Out of Stock"}
                </Button>

                <button
                    type="button"
                    onClick={() => {
                        dispatch(toggleWishlist(product));

                        toast.success(
                            isInWishlist
                                ? "Removed from Wishlist"
                                : "Added to Wishlist ❤️",
                        );
                    }}
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

            {/* Extra Info */}
            <div className="space-y-2 rounded-card bg-stone-50 p-4">
                <div className="flex items-center gap-3">
                    <Truck size={18} />
                    <span>Free Shipping Worldwide</span>
                </div>

                <div className="flex items-center gap-3">
                    <ShieldCheck size={18} />
                    <span>{inStock ? "In Stock" : "Out of Stock"}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductActions;
