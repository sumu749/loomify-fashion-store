"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import ProductCard from "@/components/products/ProductCard";

import type { Product } from "@/types/product";

interface LatestProductsProps {
    products: Product[];
}

const LatestProducts = ({ products }: LatestProductsProps) => {
    return (
        <section className="bg-stone-50 py-20 sm:py-24 lg:py-28">
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
                        subtitle="Just In"
                        title="Latest Products"
                        description="Fresh additions to the Loomify collection, selected for the season ahead."
                        className="mb-0"
                        descriptionClassName="max-w-lg"
                    />

                    <Link
                        href="/products?sort=newest"
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
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        transition={{
                            duration: 0.7,
                            delay: 0.1,
                        }}
                        className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:mt-14 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-7"
                    >
                        {products.slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </motion.div>
                ) : (
                    <div className="mt-12 rounded-2xl border border-border bg-white px-6 py-16 text-center sm:mt-14">
                        <h3 className="text-xl font-semibold text-primary">
                            No latest products available
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            New products will appear here once they are
                            published.
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

export default LatestProducts;
