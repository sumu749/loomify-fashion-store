"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Testimonial {
    id: string;
    rating: number;
    comment: string;
    user: {
        name: string | null;
    };
    product: {
        name: string;
    };
}

interface TestimonialsSliderProps {
    testimonials: Testimonial[];
}

const TestimonialsSlider = ({ testimonials }: TestimonialsSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (testimonials.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentIndex((previous) => (previous + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [testimonials.length]);

    if (testimonials.length === 0) {
        return (
            <div className="flex min-h-107.5 items-center justify-center  bg-stone-50 p-8 text-center sm:min-h-125 lg:min-h-140">
                <div>
                    <Quote size={32} className="mx-auto text-accent/60" />

                    <p className="mt-5 text-sm text-gray-500">
                        Customer stories will appear here as reviews are
                        approved.
                    </p>
                </div>
            </div>
        );
    }

    const testimonial = testimonials[currentIndex];

    return (
        <div className="relative flex min-h-107.5 flex-col justify-between overflow-hidden  bg-primary p-7 text-white sm:min-h-125 sm:p-9 lg:min-h-140 lg:p-10">
            {/* Decorative quote */}
            <Quote
                size={72}
                strokeWidth={1}
                className="absolute -right-3 -top-3 text-white/10"
            />

            {/* Header */}
            <div className="relative z-10">
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-accent sm:text-xs">
                    Customer Stories
                </p>

                <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    What They Say
                </h3>
            </div>

            {/* Testimonial */}
            <div className="relative z-10 flex-1 py-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={testimonial.id}
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -20,
                        }}
                        transition={{
                            duration: 0.55,
                        }}
                    >
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                    key={index}
                                    size={14}
                                    className={
                                        index < testimonial.rating
                                            ? "fill-accent text-accent"
                                            : "text-white/20"
                                    }
                                />
                            ))}
                        </div>

                        <blockquote className="mt-7 text-lg leading-8 text-white/90 sm:text-xl sm:leading-9">
                            “{testimonial.comment}”
                        </blockquote>

                        <div className="mt-8">
                            <p className="text-sm font-semibold">
                                {testimonial.user.name || "Loomify Customer"}
                            </p>

                            <p className="mt-1 text-xs text-white/50">
                                Reviewed {testimonial.product.name}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Indicators */}
            <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs tracking-[0.2em] text-white/40">
                    {String(currentIndex + 1).padStart(2, "0")} /{" "}
                    {String(testimonials.length).padStart(2, "0")}
                </span>

                <div className="flex items-center gap-1.5">
                    {testimonials.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            aria-label={`Show testimonial ${index + 1}`}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-px transition-all duration-300 ${
                                index === currentIndex
                                    ? "w-8 bg-accent"
                                    : "w-4 bg-white/25"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSlider;
