"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

import type { Product } from "@/types/product";

interface ProductGalleryProps {
    product: Product;
}

const ProductGallery = ({ product }: ProductGalleryProps) => {
    const images = product.images.length > 0 ? product.images : [product.image];

    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="flex flex-col-reverse gap-5 md:flex-row">
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto md:w-24 md:flex-col md:gap-4">
                {images.map((image, index) => (
                    <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        className={`shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                            selectedImage === image
                                ? "scale-105 border-accent shadow-lg"
                                : "border-transparent opacity-70 hover:scale-105 hover:border-gray-300 hover:opacity-100"
                        }`}
                    >
                        <Image
                            src={image}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            width={80}
                            height={96}
                            className="h-20 w-16 object-cover sm:h-24 sm:w-20"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 overflow-hidden rounded-card bg-stone-100">
                <motion.div
                    key={selectedImage}
                    initial={{
                        opacity: 0,
                        scale: 1.05,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.35,
                    }}
                >
                    <Image
                        src={selectedImage}
                        alt={product.name}
                        width={800}
                        height={1000}
                        priority
                        className="aspect-4/5 w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default ProductGallery;
