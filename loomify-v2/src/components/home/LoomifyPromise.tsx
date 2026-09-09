"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import promiseImage from "@/assets/images/promise.jpg";

const promises = [
    {
        title: "Premium Materials",
        description: "Thoughtfully selected fabrics and refined finishes.",
    },
    {
        title: "Timeless Design",
        description: "Pieces designed to stay relevant beyond the season.",
    },
    {
        title: "Easy Returns",
        description: "A simple and convenient return experience.",
    },
    {
        title: "Secure Checkout",
        description: "A safe and seamless way to complete your order.",
    },
];

const LoomifyPromise = () => {
    return (
        <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
            <Container>
                <div className="relative overflow-hidden bg-primary">
                    {/* Background detail */}
                    <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/5" />

                    <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full border border-white/5" />

                    <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                        {/* ================= Image ================= */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -40,
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                duration: 0.8,
                            }}
                            className="relative min-h-105 overflow-hidden sm:min-h-130 lg:min-h-155"
                        >
                            <Image
                                src={promiseImage}
                                alt="Loomify Promise"
                                fill
                                sizes="(max-width: 1024px) 100vw, 45vw"
                                className="object-cover transition-transform duration-1000 hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-primary/20" />

                            {/* Image label */}
                            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
                                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/70 sm:text-xs">
                                    The Loomify Standard
                                </p>
                            </div>
                        </motion.div>

                        {/* ================= Content ================= */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                x: 40,
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                duration: 0.8,
                                delay: 0.1,
                            }}
                            className="flex flex-col justify-center px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14 xl:px-16"
                        >
                            {/* Eyebrow */}
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                                The Loomify Promise
                            </p>

                            {/* Heading */}
                            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                                Designed for
                                <br />
                                <span className="font-light italic">
                                    Everyday Luxury.
                                </span>
                            </h2>

                            {/* Description */}
                            <p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                                We believe great style should feel effortless.
                                Every Loomify piece is selected with a focus on
                                quality, comfort, timeless design, and the
                                details that make everyday dressing feel
                                special.
                            </p>

                            {/* Promise Grid */}
                            <div className="mt-9 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                {promises.map((promise, index) => (
                                    <motion.div
                                        key={promise.title}
                                        initial={{
                                            opacity: 0,
                                            y: 15,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        viewport={{
                                            once: true,
                                        }}
                                        transition={{
                                            delay: 0.2 + index * 0.1,
                                            duration: 0.45,
                                        }}
                                        className="group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 transition-colors duration-300 group-hover:bg-accent">
                                                <Check
                                                    size={14}
                                                    className="text-accent transition-colors duration-300 group-hover:text-primary"
                                                />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-semibold text-white sm:text-base">
                                                    {promise.title}
                                                </h3>

                                                <p className="mt-1 text-xs leading-5 text-white/45 sm:text-sm">
                                                    {promise.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="mt-10">
                                <Button asChild size="lg">
                                    <Link href="/products">
                                        Explore Collection
                                        <ArrowRight size={18} />
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default LoomifyPromise;
