"use client";

import { Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/common/Container";

const benefits = [
    {
        icon: Truck,
        title: "Free Shipping",
        description: "Free shipping for orders over $100",
    },
    {
        icon: RotateCcw,
        title: "Money Guarantee",
        description: "Within 30 days for an exchange.",
    },
    {
        icon: ShieldCheck,
        title: "Flexible Payment",
        description: "Pay securely with multiple payment methods.",
    },
    {
        icon: Headphones,
        title: "Online Support",
        description: "24 hours a day, 7 days a week",
    },
];

const BenefitsSection = () => {
    return (
        <section className="border-y border-border bg-white py-12 sm:py-14">
            <Container>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;

                        return (
                            <motion.div
                                key={benefit.title}
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                className="group flex items-center gap-4 px-5 py-5 sm:px-6 lg:border-r lg:border-border lg:py-3 lg:last:border-r-0"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                                    <Icon size={23} strokeWidth={1.7} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-primary">
                                        {benefit.title}
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        {benefit.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
};

export default BenefitsSection;
