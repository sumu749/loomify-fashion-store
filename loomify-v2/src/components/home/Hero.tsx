"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import heroImage from "@/assets/images/hero.jpg";

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-stone-50">
            {/* Background accents */}
            <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

            <Container>
                <div className="relative py-6 sm:py-8 lg:py-10">
                    {/* Main Hero */}
                    <div className="relative min-h-155 overflow-hidden  bg-primary sm:min-h-170 lg:min-h-[calc(100vh-120px)]">
                        {/* Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 1.08 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 1.2,
                                ease: "easeOut",
                            }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={heroImage}
                                alt="Loomify Fashion Collection"
                                fill
                                priority
                                className="object-cover object-center"
                            />
                        </motion.div>

                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/35 to-black/5" />

                        {/* Bottom Gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/35 to-transparent" />

                        {/* Hero Content */}
                        <div className="relative z-10 flex min-h-155 items-center px-6 py-16 sm:min-h-170 sm:px-10 md:px-14 lg:min-h-[calc(100vh-120px)] lg:px-16 xl:px-20">
                            <motion.div
                                initial={{ opacity: 0, y: 35 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.15,
                                }}
                                className="max-w-2xl text-white"
                            >
                                {/* Eyebrow */}
                                <div className="flex items-center gap-3">
                                    <span className="h-px w-10 bg-white/70" />

                                    <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/85 sm:text-sm">
                                        New Season · 2026
                                    </span>
                                </div>

                                {/* Heading */}
                                <h1 className="mt-6 text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                                    Effortlessly
                                    <br />
                                    <span className="font-light italic">
                                        Elevated.
                                    </span>
                                </h1>

                                {/* Description */}
                                <p className="mt-7 max-w-xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8 lg:text-lg">
                                    Discover refined essentials designed for
                                    modern living. Timeless silhouettes, premium
                                    details, and effortless everyday style.
                                </p>

                                {/* CTA */}
                                <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
                                    <Button asChild size="lg">
                                        <Link href="/products">
                                            Shop Collection
                                            <ArrowRight size={18} />
                                        </Link>
                                    </Button>

                                    <Link
                                        href="/products?category=women"
                                        className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-primary"
                                    >
                                        Shop Women
                                    </Link>
                                </div>

                                {/* Supporting text */}
                                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/65 sm:text-sm">
                                    <span>Free shipping over $100</span>

                                    <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:block" />

                                    <span>Easy 7-day returns</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Campaign Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: 30, y: -20 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{
                                duration: 0.7,
                                delay: 0.6,
                            }}
                            className="absolute right-5 top-5 z-10 sm:right-8 sm:top-8 lg:right-10 lg:top-10"
                        >
                            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-white/30 bg-white/10 text-center text-white backdrop-blur-md sm:h-28 sm:w-28">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 sm:text-xs">
                                    New
                                </span>

                                <span className="mt-1 text-sm font-semibold sm:text-base">
                                    Arrivals
                                </span>

                                <span className="mt-1 text-[10px] text-white/70 sm:text-xs">
                                    Shop now
                                </span>
                            </div>
                        </motion.div>

                        {/* Scroll indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: 1,
                            }}
                            className="absolute bottom-6 right-6 z-10 hidden items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/60 sm:flex lg:bottom-8 lg:right-10"
                        >
                            <span>Explore</span>
                            <span className="h-px w-10 bg-white/30" />
                        </motion.div>
                    </div>

                    {/* Trust / Benefits Strip */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.8,
                        }}
                        className="relative z-20 -mt-5 mx-4 grid overflow-hidden rounded-2xl border border-border bg-white shadow-lg sm:mx-8 sm:grid-cols-3"
                    >
                        <div className="px-5 py-5 text-center sm:border-r sm:border-border">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                Free Shipping
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                On orders over $100
                            </p>
                        </div>

                        <div className="border-t border-border px-5 py-5 text-center sm:border-r sm:border-t-0 sm:border-border">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                Easy Returns
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                7-day hassle-free returns
                            </p>
                        </div>

                        <div className="border-t border-border px-5 py-5 text-center sm:border-t-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                Secure Checkout
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Safe & trusted payment
                            </p>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
};

export default Hero;
