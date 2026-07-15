import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import Container from "../common/Container";
import Button from "../common/Button";

const Newsletter = () => {
    return (
        <section className="py-24">
            <Container>
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 40,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.7,
                    }}
                    className="relative overflow-hidden rounded-card border border-border bg-stone-50 px-6 py-16 md:px-12"
                >
                    {/* Decorative Blur */}

                    <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-accent/10 blur-3xl"></div>

                    <div className="absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-primary/5 blur-3xl"></div>

                    <div className="relative z-10 mx-auto max-w-3xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                            <Sparkles size={16} />
                            Stay Connected
                        </span>

                        <h2 className="mt-6 text-4xl font-bold text-primary md:text-5xl">
                            Join the Loomify Community
                        </h2>

                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                            Be the first to discover new arrivals, exclusive
                            collections, seasonal offers, and timeless fashion
                            inspiration delivered directly to your inbox.
                        </p>

                        {/* Form */}

                        <form className="mx-auto mt-10 flex max-w-xl flex-col gap-4 sm:flex-row">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="h-14 flex-1 rounded-full border border-border bg-white px-6 outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/10"
                            />

                            <Button size="lg" className="rounded-full px-8">
                                Subscribe
                                <ArrowRight size={18} />
                            </Button>
                        </form>

                        <p className="mt-6 text-sm text-gray-500">
                            ✨ Join{" "}
                            <span className="font-semibold">10,000+</span>{" "}
                            fashion lovers. No spam. Unsubscribe anytime.
                        </p>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
};

export default Newsletter;
