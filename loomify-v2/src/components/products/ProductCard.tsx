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
        price,
        oldPrice,
        rating,
        reviews,
        badge,
    } = product;

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
            whileHover={{ y: -8 }}
            transition={{ duration: 0.25 }}
            className="group overflow-hidden rounded-card border border-border bg-white shadow-sm transition-all duration-300 hover:shadow-2xl"
        >
            {/* Image */}
            <div className="relative overflow-hidden">
                {badge && (
                    <span className="absolute left-4 top-4 z-20 rounded-full bg-accent px-3 py-1 text-xs font-semibold tracking-wide text-white">
                        {badge}
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
                    className={`absolute right-4 top-4 z-10 rounded-full p-2 shadow transition-all duration-300 ${
                        isInWishlist
                            ? "bg-accent text-white"
                            : "bg-white hover:bg-accent hover:text-white"
                    }`}
                >
                    <Heart
                        size={18}
                        fill={isInWishlist ? "currentColor" : "none"}
                    />
                </button>

                {/* Product Image */}
                <Link href={`/products/${slug}`} aria-label={`View ${name}`}>
                    <Image
                        src={image}
                        alt={name}
                        width={600}
                        height={750}
                        className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-100 transition-all duration-500 lg:opacity-0 lg:group-hover:opacity-100" />

                {/* Hover Actions */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-0 gap-3 opacity-100 transition-all duration-500 lg:translate-y-8 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                    <Link
                        href={`/products/${slug}`}
                        aria-label={`View ${name}`}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-white transition hover:bg-accent hover:text-white"
                    >
                        <Eye size={18} />
                    </Link>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        aria-label={`Add ${name} to cart`}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition hover:bg-accent"
                    >
                        <ShoppingBag size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                <div>
                    <p className="text-sm uppercase tracking-wider text-gray-500">
                        {category}
                    </p>

                    <Link
                        href={`/products/${slug}`}
                        aria-label={`View ${name}`}
                    >
                        <h3 className="mt-2 text-lg font-semibold text-primary transition group-hover:text-accent sm:text-xl">
                            {name}
                        </h3>
                    </Link>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="text-sm font-medium">{rating}</span>

                    <span className="text-sm text-gray-500">({reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-primary sm:text-2xl">
                        {formatCurrency(price)}
                    </span>

                    {oldPrice && (
                        <span className="text-gray-400 line-through">
                            {formatCurrency(oldPrice)}
                        </span>
                    )}
                </div>

                {/* Add to Cart */}
                <Button
                    onClick={handleAddToCart}
                    className="w-full translate-y-0 opacity-100 transition-all duration-500 lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
                >
                    <ShoppingBag size={18} />
                    Add to Cart
                </Button>
            </div>
        </motion.article>
    );
};

export default ProductCard;
