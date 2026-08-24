"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";

import type { Product } from "@/data/products";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <motion.article
            whileHover={{ y: -8 }}
            transition={{ duration: 0.25 }}
            className="group overflow-hidden rounded-card border border-border bg-white shadow-sm transition-all duration-300 hover:shadow-2xl"
        >
            <div className="relative overflow-hidden">
                {product.badge && (
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold tracking-wide text-white">
                        {product.badge}
                    </span>
                )}
                <button
                    type="button"
                    aria-label={`Add ${product.name} to wishlist`}
                    className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow transition hover:bg-accent hover:text-white"
                >
                    <Heart size={18} />
                </button>
                <Link href={`/products/${product.id}`}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={600}
                        height={750}
                        className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>
            </div>
            <div className="space-y-3 p-4 sm:p-6">
                <div>
                    <p className="text-sm uppercase tracking-wider text-gray-500">
                        {product.category}
                    </p>
                    <Link href={`/products/${product.id}`}>
                        <h3 className="mt-2 text-lg font-semibold text-primary transition group-hover:text-accent sm:text-xl">
                            {product.name}
                        </h3>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-sm font-medium">
                        {product.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                        ({product.reviews})
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-primary sm:text-2xl">
                        ${product.price}
                    </span>
                    {product.oldPrice && (
                        <span className="text-gray-400 line-through">
                            ${product.oldPrice}
                        </span>
                    )}
                </div>
                <Link
                    href={`/products/${product.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white transition hover:bg-accent"
                >
                    <ShoppingBag size={18} /> View Product
                </Link>
            </div>
        </motion.article>
    );
};

export default ProductCard;
