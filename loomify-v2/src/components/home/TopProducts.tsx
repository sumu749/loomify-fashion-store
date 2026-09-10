/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import ProductCard from "@/components/products/ProductCard";

import type { Product } from "@/types/product";

interface TopProductsProps {
    products: Product[];
}

const PRODUCTS_PER_SLIDE = 4;

const TopProducts = ({ products }: TopProductsProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = useMemo(() => {
        const result: Product[][] = [];

        for (
            let index = 0;
            index < products.length;
            index += PRODUCTS_PER_SLIDE
        ) {
            result.push(products.slice(index, index + PRODUCTS_PER_SLIDE));
        }

        return result;
    }, [products]);

    const totalSlides = slides.length;

    useEffect(() => {
        if (totalSlides <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentSlide((previous) =>
                previous + 1 >= totalSlides ? 0 : previous + 1,
            );
        }, 6000);

        return () => clearInterval(interval);
    }, [totalSlides]);

    useEffect(() => {
        if (currentSlide >= totalSlides && totalSlides > 0) {
            setCurrentSlide(0);
        }
    }, [currentSlide, totalSlides]);

    const goToNext = () => {
        if (totalSlides <= 1) {
            return;
        }

        setCurrentSlide((previous) =>
            previous + 1 >= totalSlides ? 0 : previous + 1,
        );
    };

    const goToPrevious = () => {
        if (totalSlides <= 1) {
            return;
        }

        setCurrentSlide((previous) =>
            previous - 1 < 0 ? totalSlides - 1 : previous - 1,
        );
    };

    const currentProducts = slides[currentSlide] ?? [];

    return (
        <section className="py-20 sm:py-24 lg:py-28">
            <Container>
                {/* Header */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 25,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
                >
                    <SectionTitle
                        align="left"
                        subtitle="Loomify Edit"
                        title="Top Products"
                        description="Discover the pieces our collection is known for."
                        className="mb-0"
                        descriptionClassName="max-w-lg"
                    />

                    <Link
                        href="/products"
                        className="group mb-2 inline-flex items-center gap-2 self-start border-b border-primary pb-1 text-sm font-medium text-primary transition-colors hover:border-accent hover:text-accent sm:self-auto"
                    >
                        View All Products
                        <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                </motion.div>

                {/* Products */}
                {products.length > 0 ? (
                    <>
                        <div className="mt-12 overflow-hidden sm:mt-14">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={currentSlide}
                                    initial={{
                                        opacity: 0,
                                        x: 70,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: -70,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        ease: [0.76, 0, 0.24, 1],
                                    }}
                                    className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-7"
                                >
                                    {currentProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Slider controls */}
                        {totalSlides > 1 && (
                            <div className="mt-10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={goToPrevious}
                                        aria-label="Previous products"
                                        className="flex h-10 w-10 items-center justify-center border border-border bg-white text-primary transition-colors hover:border-accent hover:bg-accent hover:text-white"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={goToNext}
                                        aria-label="Next products"
                                        className="flex h-10 w-10 items-center justify-center border border-border bg-white text-primary transition-colors hover:border-accent hover:bg-accent hover:text-white"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-medium tracking-[0.2em] text-gray-400">
                                        {String(currentSlide + 1).padStart(
                                            2,
                                            "0",
                                        )}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        {slides.map((_, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                aria-label={`Show product group ${
                                                    index + 1
                                                }`}
                                                onClick={() =>
                                                    setCurrentSlide(index)
                                                }
                                                className={`h-px transition-all duration-300 ${
                                                    index === currentSlide
                                                        ? "w-8 bg-accent"
                                                        : "w-4 bg-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    <span className="text-[11px] font-medium tracking-[0.2em] text-gray-300">
                                        {String(totalSlides).padStart(2, "0")}
                                    </span>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="mt-12 rounded-2xl border border-border bg-stone-50 px-6 py-16 text-center sm:mt-14">
                        <h3 className="text-xl font-semibold text-primary">
                            No top products yet
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Products selected as featured from the admin panel
                            will appear here.
                        </p>

                        <Link
                            href="/products"
                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-accent"
                        >
                            Explore all products
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </Container>
        </section>
    );
};

export default TopProducts;
