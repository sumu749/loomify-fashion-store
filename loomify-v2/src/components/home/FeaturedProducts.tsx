"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Container from "@/components/common/Container";
import ProductCard from "@/components/products/ProductCard";

import type { Product } from "@/types/product";

interface FeaturedProductsProps {
    products: Product[];
}

const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
    return (
        <section className="py-20 sm:py-24">
            <Container>
                {/* ================= Tabs ================= */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 flex items-center justify-center sm:mb-12"
                >
                    <div className="flex items-center gap-8 sm:gap-12">
                        <button
                            type="button"
                            className="relative pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent sm:text-sm"
                        >
                            Featured
                            <span className="absolute bottom-0 left-0 h-px w-full bg-accent" />
                        </button>

                        <Link
                            href="/products?category=women"
                            className="pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 transition-colors hover:text-accent sm:text-sm"
                        >
                            Clothing
                        </Link>

                        <Link
                            href="/products"
                            className="pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 transition-colors hover:text-accent sm:text-sm"
                        >
                            Collections
                        </Link>
                    </div>
                </motion.div>

                {/* ================= Products ================= */}

                {products.length > 0 ? (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.7,
                                delay: 0.1,
                            }}
                            className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-7"
                        >
                            {products.slice(0, 4).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </motion.div>

                        {/* View all */}
                        <div className="mt-12 flex justify-center">
                            <Link
                                href="/products"
                                className="group inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-medium text-primary transition-colors hover:border-accent hover:text-accent"
                            >
                                View All Products
                                <ArrowRight
                                    size={16}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="rounded-2xl border border-border bg-stone-50 px-6 py-16 text-center">
                        <h3 className="text-xl font-semibold text-primary">
                            No featured products yet
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Featured products selected from the admin panel will
                            appear here.
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

export default FeaturedProducts;
