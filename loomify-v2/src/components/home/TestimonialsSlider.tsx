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
            <div className="flex min-h-90 items-center justify-center border border-border bg-white p-7 text-center sm:min-h-107.5 lg:min-h-130 lg:p-10">
                <div className="max-w-xs">
                    <Quote
                        size={30}
                        strokeWidth={1.5}
                        className="mx-auto text-accent"
                    />

                    <p className="mt-5 text-sm leading-6 text-gray-500">
                        Customer stories will appear here as reviews are
                        approved.
                    </p>
                </div>
            </div>
        );
    }

    const testimonial = testimonials[currentIndex];

    return (
        <div className="relative flex min-h-90 flex-col justify-between overflow-hidden border border-border bg-white p-7 sm:min-h-107.5 sm:p-8 lg:min-h-130 lg:p-10">
            {/* Decorative quote */}
            <Quote
                size={78}
                strokeWidth={1}
                className="absolute -right-3 -top-3 text-stone-100"
            />

            {/* Header */}
            <div className="relative z-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent sm:text-xs">
                    Customer Stories
                </p>

                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
                    What They Say
                </h3>
            </div>

            {/* Testimonial */}
            <div className="relative z-10 flex flex-1 items-center py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={testimonial.id}
                        initial={{
                            opacity: 0,
                            y: 16,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -16,
                        }}
                        transition={{
                            duration: 0.5,
                        }}
                    >
                        {/* Rating */}
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                    key={index}
                                    size={13}
                                    className={
                                        index < testimonial.rating
                                            ? "fill-accent text-accent"
                                            : "text-gray-200"
                                    }
                                />
                            ))}
                        </div>

                        {/* Quote */}
                        <blockquote className="mt-6 text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                            “{testimonial.comment}”
                        </blockquote>

                        {/* Customer */}
                        <div className="mt-7 border-l-2 border-accent pl-4">
                            <p className="text-sm font-semibold text-primary">
                                {testimonial.user.name || "Loomify Customer"}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Reviewed {testimonial.product.name}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Indicators */}
            <div className="relative z-10 flex items-center justify-between border-t border-border pt-4">
                <span className="text-[11px] font-medium tracking-[0.2em] text-gray-400">
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
                                    : "w-4 bg-gray-200"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSlider;
