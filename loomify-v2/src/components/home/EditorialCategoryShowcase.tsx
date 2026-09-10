"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import type { Category } from "@/types/category";

interface EditorialCategoryShowcaseProps {
    categories: Category[];
}

const EditorialCategoryShowcase = ({
    categories,
}: EditorialCategoryShowcaseProps) => {
    const [currentPair, setCurrentPair] = useState(0);

    const totalPairs = Math.ceil(categories.length / 2);

    const startIndex = currentPair * 2;

    const currentCategories = categories.slice(startIndex, startIndex + 2);

    const goToNext = () => {
        setCurrentPair((previous) =>
            previous + 1 >= totalPairs ? 0 : previous + 1,
        );
    };

    const goToPrevious = () => {
        setCurrentPair((previous) =>
            previous - 1 < 0 ? totalPairs - 1 : previous - 1,
        );
    };

    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            {/* Category Pair */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPair}
                    initial={{
                        opacity: 0,
                        x: 40,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    exit={{
                        opacity: 0,
                        x: -40,
                    }}
                    transition={{
                        duration: 0.55,
                        ease: "easeOut",
                    }}
                    className="grid grid-cols-2 gap-3 sm:gap-5"
                >
                    {currentCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/products?category=${encodeURIComponent(
                                category.slug,
                            )}`}
                            className="group block"
                        >
                            <article className="relative min-h-90 overflow-hidden bg-stone-100 sm:min-h-107.5 lg:min-h-130">
                                {category.image ? (
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        fill
                                        sizes="(max-width: 1024px) 50vw, 30vw"
                                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-sm text-gray-400">
                                        No image available
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                                {/* Category */}
                                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
                                    <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/65 sm:text-xs">
                                        {category.products}{" "}
                                        {category.products === 1
                                            ? "item"
                                            : "items"}
                                    </p>

                                    <div className="mt-2 flex items-end justify-between gap-3">
                                        <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                            {category.title}
                                        </h3>

                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-primary">
                                            <ChevronRight size={17} />
                                        </span>
                                    </div>

                                    <span className="mt-3 inline-block border-b border-white/50 pb-1 text-xs font-medium text-white/85">
                                        Explore collection
                                    </span>
                                </div>
                            </article>
                        </Link>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            {totalPairs > 1 && (
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={goToPrevious}
                            aria-label="Previous categories"
                            className="flex h-9 w-9 items-center justify-center border border-border bg-white text-primary transition-colors hover:border-accent hover:bg-accent hover:text-white"
                        >
                            <ChevronLeft size={17} />
                        </button>

                        <button
                            type="button"
                            onClick={goToNext}
                            aria-label="Next categories"
                            className="flex h-9 w-9 items-center justify-center border border-border bg-white text-primary transition-colors hover:border-accent hover:bg-accent hover:text-white"
                        >
                            <ChevronRight size={17} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-medium tracking-[0.2em] text-gray-400">
                            {String(currentPair + 1).padStart(2, "0")}
                        </span>

                        <div className="flex items-center gap-1.5">
                            {Array.from({ length: totalPairs }).map(
                                (_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        aria-label={`Show category group ${
                                            index + 1
                                        }`}
                                        onClick={() => setCurrentPair(index)}
                                        className={`h-px transition-all duration-300 ${
                                            index === currentPair
                                                ? "w-8 bg-accent"
                                                : "w-4 bg-gray-300"
                                        }`}
                                    />
                                ),
                            )}
                        </div>

                        <span className="text-[11px] font-medium tracking-[0.2em] text-gray-300">
                            {String(totalPairs).padStart(2, "0")}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditorialCategoryShowcase;
