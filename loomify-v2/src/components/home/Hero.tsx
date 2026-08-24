"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import heroImage from "@/assets/images/hero.jpg";

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-linear-to-b from-white via-white to-stone-50">
            {/* Background Decoration */}
            <div className="absolute -right-28 top-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -left-20 bottom-10 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />

            <Container>
                <div className="grid items-center gap-10 py-16 sm:gap-16 lg:min-h-[calc(100vh-80px)] lg:grid-cols-2 lg:py-0">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center rounded-full bg-accent/10 px-5 py-2 text-sm font-medium text-accent">
                            ✨ New Collection 2026
                        </span>

                        <h1 className="mt-8 text-4xl font-extrabold leading-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                            Wear Your
                            <br />
                            Confidence
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 sm:mt-8 sm:text-lg sm:leading-8">
                            Premium fashion crafted for modern lifestyles.
                            Discover timeless pieces designed to elevate your
                            everyday wardrobe with elegance and comfort.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10 sm:gap-5">
                            <Button asChild href="/products" size="lg">
                                Shop Collection
                                <ArrowRight size={18} />
                            </Button>
                        </div>

                        <p className="mt-4 text-sm text-gray-500 sm:mt-5">
                            Free shipping on orders over $100
                        </p>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                        }}
                    >
                        <div className="overflow-hidden rounded-card shadow-card">
                            <Image
                                src={heroImage}
                                alt="Loomify Fashion Collection"
                                priority
                                className="aspect-4/5 w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
};

export default Hero;
