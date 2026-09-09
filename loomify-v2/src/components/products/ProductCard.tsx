"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";
import { addToCart } from "@/features/cart/cartSlice";
import { toggleWishlist } from "@/features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Product } from "@/types/product";
import formatCurrency from "@/utils/formatCurrency";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const dispatch = useAppDispatch();

    const isInWishlist = useAppSelector((state) =>
        state.wishlist.items.some((item) => item.id === product.id),
    );

    const {
        slug,
        name,
        category,
        image,
        images,
        price,
        oldPrice,
        rating,
        reviews,
    } = product;

    const hoverImage = images?.[1] ?? image;

    const discountPercentage =
        oldPrice && oldPrice > price
            ? Math.round(((oldPrice - price) / oldPrice) * 100)
            : null;

    const handleAddToCart = () => {
        const defaultVariant = product.variants.find(
            (variant) => variant.stock > 0,
        );

        if (!defaultVariant) {
            toast.error("Product is out of stock");
            return;
        }

        dispatch(
            addToCart({
                product,
                variantId: defaultVariant.id,
                quantity: 1,
            }),
        );

        toast.success(`${name} added to cart`);
    };

    const handleToggleWishlist = () => {
        const wasInWishlist = isInWishlist;

        dispatch(toggleWishlist(product));

        if (wasInWishlist) {
            toast.success("Removed from Wishlist");
        } else {
            toast.success("Added to Wishlist ❤️");
        }
    };

    return (
        <motion.article
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="group"
        >
            {/* ================= Image ================= */}

            <div className="relative overflow-hidden bg-stone-100">
                {/* Discount */}
                {discountPercentage && (
                    <span className="absolute left-3 top-3 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xs font-medium text-white sm:left-4 sm:top-4 sm:h-14 sm:w-14">
                        -{discountPercentage}%
                    </span>
                )}

                {/* Wishlist */}
                <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label={
                        isInWishlist
                            ? `Remove ${name} from wishlist`
                            : `Add ${name} to wishlist`
                    }
                    className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 sm:right-4 sm:top-4 ${
                        isInWishlist
                            ? "bg-accent text-white"
                            : "bg-white/90 text-primary opacity-100 shadow-sm lg:opacity-0 lg:group-hover:opacity-100"
                    }`}
                >
                    <Heart
                        size={17}
                        fill={isInWishlist ? "currentColor" : "none"}
                    />
                </button>

                {/* Product Images */}
                <Link
                    href={`/products/${slug}`}
                    aria-label={`View ${name}`}
                    className="relative block aspect-4/5 overflow-hidden"
                >
                    {/* Primary image */}
                    {image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                            className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-sm text-gray-400">
                            No image
                        </div>
                    )}

                    {/* Hover image */}
                    {hoverImage && hoverImage !== image && (
                        <Image
                            src={hoverImage}
                            alt={`${name} alternate view`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                            className="absolute inset-0 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                        />
                    )}

                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />

                    {/* Quick View */}
                    <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white opacity-100 shadow-lg transition-all duration-500 lg:scale-75 lg:opacity-0 lg:group-hover:scale-100 lg:group-hover:opacity-100">
                            <Eye size={18} />
                        </span>
                    </div>
                </Link>
            </div>

            {/* ================= Product Info ================= */}

            <div className="pt-5 text-center sm:pt-6">
                {/* Category */}
                <Link
                    href={`/products?category=${encodeURIComponent(category)}`}
                    className="inline-block text-[11px] font-medium uppercase tracking-[0.16em] text-gray-400 transition-colors hover:text-accent"
                >
                    {category}
                </Link>

                {/* Product Name */}
                <Link
                    href={`/products/${slug}`}
                    aria-label={`View ${name}`}
                    className="block"
                >
                    <h3 className="mt-2 text-base font-medium text-primary transition-colors hover:text-accent sm:text-lg">
                        {name}
                    </h3>
                </Link>

                {/* Rating */}
                {reviews > 0 && (
                    <div className="mt-2 flex items-center justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                                key={index}
                                size={13}
                                className={
                                    index < Math.round(rating)
                                        ? "fill-accent text-accent"
                                        : "text-gray-300"
                                }
                            />
                        ))}

                        <span className="ml-1 text-xs text-gray-400">
                            ({reviews})
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="text-base font-semibold text-accent sm:text-lg">
                        {formatCurrency(price)}
                    </span>

                    {oldPrice && oldPrice > price && (
                        <span className="text-sm text-gray-400 line-through">
                            {formatCurrency(oldPrice)}
                        </span>
                    )}
                </div>

                {/* Add to cart */}
                <div className="mt-4 overflow-hidden">
                    <Button
                        onClick={handleAddToCart}
                        size="sm"
                        className="w-full translate-y-0 opacity-100 transition-all duration-500 lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
                    >
                        <ShoppingBag size={16} />
                        Add to Cart
                    </Button>
                </div>
            </div>
        </motion.article>
    );
};

export default ProductCard;
