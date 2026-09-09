"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import type { Product } from "@/types/product";

interface ProductGalleryProps {
    product: Product;
}

const ProductGallery = ({ product }: ProductGalleryProps) => {
    const images =
        product.images.length > 0
            ? product.images
            : [product.image].filter(Boolean);

    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectedImage = images[selectedIndex];

    const goToPrevious = () => {
        setSelectedIndex((current) =>
            current === 0 ? images.length - 1 : current - 1,
        );
    };

    const goToNext = () => {
        setSelectedIndex((current) =>
            current === images.length - 1 ? 0 : current + 1,
        );
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}

            <div className="group relative overflow-hidden rounded-2xl bg-stone-100 shadow-sm">
                <motion.div
                    key={selectedImage}
                    initial={{
                        opacity: 0,
                        scale: 1.03,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.3,
                    }}
                >
                    {selectedImage ? (
                        <Image
                            src={selectedImage}
                            alt={product.name}
                            width={900}
                            height={1125}
                            priority
                            className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div className="flex aspect-4/5 items-center justify-center text-sm text-gray-400">
                            No image available
                        </div>
                    )}
                </motion.div>

                {/* Navigation */}

                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={goToPrevious}
                            aria-label="Previous product image"
                            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary opacity-100 shadow-sm backdrop-blur transition hover:bg-primary hover:text-white lg:opacity-0 lg:group-hover:opacity-100"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <button
                            type="button"
                            onClick={goToNext}
                            aria-label="Next product image"
                            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary opacity-100 shadow-sm backdrop-blur transition hover:bg-primary hover:text-white lg:opacity-0 lg:group-hover:opacity-100"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}

                {/* Image Counter */}

                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                        {selectedIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}

            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {images.map((image, index) => {
                        const isSelected = selectedIndex === index;

                        return (
                            <button
                                key={`${image}-${index}`}
                                type="button"
                                onClick={() => setSelectedIndex(index)}
                                aria-label={`View image ${index + 1}`}
                                className={`shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                    isSelected
                                        ? "border-accent shadow-md"
                                        : "border-transparent opacity-70 hover:border-gray-300 hover:opacity-100"
                                }`}
                            >
                                <Image
                                    src={image}
                                    alt={`${product.name} thumbnail ${
                                        index + 1
                                    }`}
                                    width={96}
                                    height={120}
                                    className="h-20 w-16 object-cover sm:h-24 sm:w-20"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
