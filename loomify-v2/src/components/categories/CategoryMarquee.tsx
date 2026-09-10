"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Category } from "@/types/category";

interface CategoryMarqueeProps {
    categories: Category[];
}

const CategoryMarquee = ({ categories }: CategoryMarqueeProps) => {
    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="relative overflow-hidden">
            {/* Left fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent sm:w-24" />

            {/* Right fade */}
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent sm:w-24" />

            <div className="group">
                <div className="flex w-max animate-[category-marquee_28s_linear_infinite] gap-6 group-hover:[animation-play-state:paused] sm:gap-8">
                    {[...categories, ...categories].map((category, index) => (
                        <Link
                            key={`${category.id}-${index}`}
                            href={`/products?category=${encodeURIComponent(
                                category.slug,
                            )}`}
                            className="group/item w-32.5 shrink-0 text-center sm:w-37.5 md:w-41.25"
                        >
                            {/* Image */}
                            <div className="relative mx-auto aspect-square overflow-hidden rounded-full bg-stone-100">
                                {category.image ? (
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        fill
                                        sizes="165px"
                                        className="object-cover transition-transform duration-700 ease-out group-hover/item:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                                        No image
                                    </div>
                                )}

                                {/* Hover overlay */}
                                <div className="absolute inset-0 rounded-full bg-black/0 transition-colors duration-300 group-hover/item:bg-black/10" />

                                {/* Arrow */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow-md transition-all duration-300 group-hover/item:scale-100 group-hover/item:opacity-100">
                                        <ArrowUpRight size={17} />
                                    </span>
                                </div>
                            </div>

                            {/* Category */}
                            <h3 className="mt-4 text-sm font-semibold text-primary transition-colors duration-300 group-hover/item:text-accent sm:text-base">
                                {category.title}
                            </h3>

                            {/* Products */}
                            <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                                {category.products}{" "}
                                {category.products === 1 ? "item" : "items"}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryMarquee;
