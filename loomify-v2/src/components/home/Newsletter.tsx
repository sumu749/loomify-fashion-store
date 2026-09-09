"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";

import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

const Newsletter = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
    };

    return (
        <section className="py-20 sm:py-24 lg:py-28">
            <Container>
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.7,
                    }}
                    className="relative overflow-hidden rounded-4xl bg-primary px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20"
                >
                    {/* Decorative elements */}
                    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/5" />

                    <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-white/5" />

                    <div className="pointer-events-none absolute left-1/2 top-0 h-px w-32 -translate-x-1/2 bg-accent/60" />

                    <div className="relative z-10 mx-auto max-w-3xl text-center">
                        {/* Eyebrow */}
                        <div className="inline-flex items-center gap-3">
                            <span className="h-px w-8 bg-accent/70" />

                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                                Stay in the loop
                            </p>

                            <span className="h-px w-8 bg-accent/70" />
                        </div>

                        {/* Heading */}
                        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                            A little inspiration,
                            <br />
                            <span className="font-light italic">
                                straight to your inbox.
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                            Be the first to discover new arrivals, seasonal
                            edits, exclusive offers, and thoughtfully curated
                            style inspiration from Loomify.
                        </p>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="mx-auto mt-9 max-w-2xl"
                        >
                            <div className="flex flex-col gap-3 rounded-2xl bg-white/5 p-2 ring-1 ring-white/10 backdrop-blur-sm sm:flex-row sm:rounded-full">
                                <div className="flex h-12 flex-1 items-center gap-3 px-4 sm:h-14 sm:pl-5">
                                    <Mail
                                        size={18}
                                        className="shrink-0 text-white/35"
                                    />

                                    <input
                                        type="email"
                                        required
                                        aria-label="Email address"
                                        placeholder="Enter your email address"
                                        className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full rounded-xl px-7 sm:w-auto sm:rounded-full"
                                >
                                    Subscribe
                                    <ArrowRight size={17} />
                                </Button>
                            </div>
                        </form>

                        {/* Success */}
                        {submitted ? (
                            <motion.p
                                initial={{
                                    opacity: 0,
                                    y: 5,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                className="mt-5 text-sm font-medium text-accent"
                                role="status"
                            >
                                Thank you for joining the Loomify list.
                            </motion.p>
                        ) : (
                            <p className="mt-5 text-xs text-white/35">
                                No spam. Just thoughtful fashion updates.
                            </p>
                        )}
                    </div>
                </motion.div>
            </Container>
        </section>
    );
};

export default Newsletter;
