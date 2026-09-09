"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import type { Category } from "@/types/category";

interface CategoryCarouselProps {
    categories: Category[];
}

const CategoryCarousel = ({ categories }: CategoryCarouselProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;

        const amount = scrollRef.current.clientWidth * 0.75;

        scrollRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative">
            {/* Previous */}
            {categories.length > 1 && (
                <button
                    type="button"
                    onClick={() => scroll("left")}
                    aria-label="Previous categories"
                    className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-md transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white lg:flex"
                >
                    <ChevronLeft size={20} />
                </button>
            )}

            {/* Categories */}
            <div
                ref={scrollRef}
                className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-2 pb-3 scrollbar-none [&::-webkit-scrollbar]:hidden sm:gap-8 md:gap-10"
            >
                {categories.map((category) => {
                    const image =
                        category.image ?? "/images/placeholder-product.jpg";

                    return (
                        <Link
                            key={category.id}
                            href={`/products?category=${encodeURIComponent(
                                category.slug,
                            )}`}
                            className="group w-30 shrink-0 snap-start text-center sm:w-35 md:w-38.75"
                        >
                            {/* Image */}
                            <div className="relative mx-auto aspect-square w-full max-w-38.75 overflow-hidden rounded-full bg-stone-100">
                                <Image
                                    src={image}
                                    alt={category.title}
                                    fill
                                    sizes="155px"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />

                                {/* Hover overlay */}
                                <div className="absolute inset-0 rounded-full bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

                                {/* Arrow */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                                        <ChevronRight size={18} />
                                    </span>
                                </div>
                            </div>

                            {/* Name */}
                            <h3 className="mt-5 text-sm font-semibold text-primary transition-colors duration-300 group-hover:text-accent sm:text-base">
                                {category.title}
                            </h3>

                            {/* Product Count */}
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                {category.products}{" "}
                                {category.products === 1 ? "item" : "items"}
                            </p>
                        </Link>
                    );
                })}
            </div>

            {/* Next */}
            {categories.length > 1 && (
                <button
                    type="button"
                    onClick={() => scroll("right")}
                    aria-label="Next categories"
                    className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-md transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white lg:flex"
                >
                    <ChevronRight size={20} />
                </button>
            )}
        </div>
    );
};

export default CategoryCarousel;
