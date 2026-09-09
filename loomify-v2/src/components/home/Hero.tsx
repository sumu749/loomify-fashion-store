/* eslint-disable indent */
"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

const heroSlides = [
    {
        image: "https://images.unsplash.com/photo-1628102160424-5f4ab3404829?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        eyebrow: "New Season",
        title: "The Art of Everyday Style",
        description:
            "Refined essentials designed to bring effortless elegance to your everyday wardrobe.",
    },
    {
        image: "https://images.unsplash.com/photo-1632129460818-7e7fb9603a53?q=80&w=699&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        eyebrow: "Modern Essentials",
        title: "Designed to Be Remembered",
        description:
            "Thoughtful silhouettes and timeless pieces made for modern living.",
    },
    {
        image: "https://images.unsplash.com/photo-1545911825-6bfa5b0c34a9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        eyebrow: "Effortless Elegance",
        title: "Less, But Better",
        description:
            "A considered collection of premium pieces that move effortlessly with you.",
    },
    {
        image: "https://images.unsplash.com/photo-1580651214613-f4692d6d138f?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        eyebrow: "Curated Collection",
        title: "Style Without Compromise",
        description:
            "Discover elevated essentials where comfort, confidence, and character meet.",
    },
    {
        image: "https://images.unsplash.com/photo-1599309329365-0a9ed45a1da3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        eyebrow: "Loomify Collection",
        title: "Made for Your Moment",
        description:
            "Find pieces that feel as good as they look, from everyday essentials to statement styles.",
    },
];

type Direction = "left" | "right" | "top" | "bottom" | "diagonal";

const directions: Direction[] = ["right", "left", "bottom", "top", "diagonal"];

const imageVariants = {
    enter: (direction: Direction) => {
        switch (direction) {
            case "left":
                return {
                    x: "-18%",
                    clipPath: "inset(0 0 0 100%)",
                    scale: 1.05,
                };

            case "right":
                return {
                    x: "18%",
                    clipPath: "inset(0 100% 0 0)",
                    scale: 1.05,
                };

            case "top":
                return {
                    y: "-14%",
                    clipPath: "inset(100% 0 0 0)",
                    scale: 1.05,
                };

            case "bottom":
                return {
                    y: "14%",
                    clipPath: "inset(0 0 100% 0)",
                    scale: 1.05,
                };

            case "diagonal":
                return {
                    x: "10%",
                    y: "-8%",
                    clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
                    scale: 1.08,
                };
        }
    },

    center: {
        x: 0,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
    },

    exit: (direction: Direction) => {
        switch (direction) {
            case "left":
                return {
                    x: "-12%",
                    clipPath: "inset(0 100% 0 0)",
                    scale: 1.03,
                };

            case "right":
                return {
                    x: "12%",
                    clipPath: "inset(0 0 0 100%)",
                    scale: 1.03,
                };

            case "top":
                return {
                    y: "-10%",
                    clipPath: "inset(0 0 100% 0)",
                    scale: 1.03,
                };

            case "bottom":
                return {
                    y: "10%",
                    clipPath: "inset(100% 0 0 0)",
                    scale: 1.03,
                };

            case "diagonal":
                return {
                    x: "-8%",
                    y: "8%",
                    clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
                    scale: 1.04,
                };
        }
    },
};

const contentVariants = {
    enter: {
        opacity: 0,
        y: 28,
    },
    center: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        y: -20,
    },
};

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState<Direction>("right");

    const slide = heroSlides[currentSlide];

    const goToNext = useCallback(() => {
        setDirection(directions[currentSlide]);

        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, [currentSlide]);

    const goToPrevious = () => {
        const previousIndex =
            (currentSlide - 1 + heroSlides.length) % heroSlides.length;

        setDirection(directions[previousIndex]);

        setCurrentSlide(previousIndex);
    };

    const goToSlide = (index: number) => {
        if (index === currentSlide) return;

        setDirection(directions[index]);
        setCurrentSlide(index);
    };

    useEffect(() => {
        const interval = setInterval(goToNext, 6000);

        return () => clearInterval(interval);
    }, [goToNext]);

    return (
        <section className="bg-stone-50 pb-14 sm:pb-16">
            <Container>
                <div className="relative pt-4 sm:pt-6">
                    {/* ================= Hero ================= */}

                    <div className="relative overflow-hidden ">
                        {/* Images */}
                        <AnimatePresence
                            initial={false}
                            custom={direction}
                            mode="sync"
                        >
                            <motion.div
                                key={currentSlide}
                                custom={direction}
                                variants={imageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: 1.05,
                                    ease: [0.76, 0, 0.24, 1],
                                }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={slide.image}
                                    alt={`Loomify — ${slide.title}`}
                                    fill
                                    priority={currentSlide === 0}
                                    sizes="100vw"
                                    className="object-cover"
                                />

                                <div className="absolute inset-0 bg-black/10" />

                                <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/25 to-transparent" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Hero Content */}
                        <div className="relative z-10 flex min-h-140 items-center px-6 py-20 sm:min-h-155 sm:px-10 md:px-14 lg:min-h-162.5 lg:px-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    variants={contentVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        duration: 0.7,
                                        delay: 0.18,
                                        ease: "easeOut",
                                    }}
                                    className="max-w-xl text-white"
                                >
                                    <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/80 sm:text-sm">
                                        {slide.eyebrow} · 2026
                                    </p>

                                    <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">
                                        {slide.title}
                                    </h1>

                                    <p className="mt-7 max-w-md text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
                                        {slide.description}
                                    </p>

                                    <div className="mt-9 flex flex-wrap items-center gap-5">
                                        <Button asChild size="lg">
                                            <Link href="/products">
                                                Shop Collection
                                                <ArrowRight size={18} />
                                            </Link>
                                        </Button>

                                        <Link
                                            href="/products?category=women"
                                            className="group inline-flex items-center gap-2 border-b border-white/60 pb-1 text-sm font-medium text-white transition hover:border-white"
                                        >
                                            Explore Women
                                            <ArrowRight
                                                size={16}
                                                className="transition-transform duration-300 group-hover:translate-x-1"
                                            />
                                        </Link>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Slide Controls */}
                        <div className="absolute bottom-7 left-6 z-20 flex items-center gap-3 sm:left-10 lg:left-20">
                            <button
                                type="button"
                                onClick={goToPrevious}
                                aria-label="Previous slide"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/10 text-white backdrop-blur-sm transition hover:bg-white hover:text-primary"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <button
                                type="button"
                                onClick={goToNext}
                                aria-label="Next slide"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/10 text-white backdrop-blur-sm transition hover:bg-white hover:text-primary"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Slide Indicator */}
                        <div className="absolute bottom-8 right-6 z-20 flex items-center gap-4 text-white sm:right-10 lg:right-20">
                            <span className="text-xs font-medium tracking-[0.2em] text-white/70">
                                {String(currentSlide + 1).padStart(2, "0")}
                            </span>

                            <div className="flex items-center gap-1.5">
                                {heroSlides.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        aria-label={`Go to slide ${index + 1}`}
                                        onClick={() => goToSlide(index)}
                                        className={`h-px transition-all duration-300 ${
                                            index === currentSlide
                                                ? "w-10 bg-white"
                                                : "w-5 bg-white/40"
                                        }`}
                                    />
                                ))}
                            </div>

                            <span className="text-xs font-medium tracking-[0.2em] text-white/50">
                                {String(heroSlides.length).padStart(2, "0")}
                            </span>
                        </div>
                    </div>

                    {/* ================= Trust / Benefits ================= */}

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.8,
                        }}
                        className="relative z-20 mx-4 -mt-5 overflow-hidden rounded-2xl border border-border bg-white shadow-lg sm:mx-8"
                    >
                        <div className="grid sm:grid-cols-3">
                            <div className="px-5 py-5 text-center sm:border-r sm:border-border">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                    Free Shipping
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    On orders over $100
                                </p>
                            </div>

                            <div className="border-t border-border px-5 py-5 text-center sm:border-r sm:border-t-0">
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
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
};

export default Hero;
