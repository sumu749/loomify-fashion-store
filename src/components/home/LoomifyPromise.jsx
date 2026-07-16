import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import SectionTitle from "../common/SectionTitle";
import Container from "../common/Container";
import Button from "../common/Button";
import promiseImage from "../../assets/images/promise.jpg";

const features = [
    "Premium Materials",
    "Free Worldwide Shipping",
    "30-Day Easy Returns",
    "Secure Checkout",
];

const LoomifyPromise = () => {
    return (
        <section className="relative overflow-hidden py-24">
            {/* Background Decoration */}

            <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl"></div>

            <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>

            <Container>
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    {/* ================= Left Image ================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -60,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                        }}
                        className="mx-auto w-full max-w-lg"
                    >
                        <motion.div
                            whileHover={{
                                scale: 1.03,
                                rotate: -1,
                            }}
                            transition={{
                                duration: 0.35,
                            }}
                            className="overflow-hidden rounded-card shadow-card"
                        >
                            <img
                                src={promiseImage}
                                alt="Loomify Promise"
                                className="aspect-4/5 w-full object-cover transition duration-700 hover:scale-110"
                            />
                        </motion.div>
                    </motion.div>

                    {/* ================= Right Content ================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 60,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                        }}
                    >
                        <SectionTitle
                            align="left"
                            subtitle="The Loomify Promise"
                            title="Designed for Everyday Luxury."
                            description="Every piece at Loomify is thoughtfully crafted with premium fabrics, timeless aesthetics, and exceptional attention to detail—bringing comfort, confidence, and effortless style into your everyday life."
                            className="mb-10"
                            descriptionClassName="max-w-lg text-lg"
                        />

                        {/* Features */}

                        <div className="mt-10 space-y-5">
                            {features.map((item, index) => (
                                <motion.div
                                    key={item}
                                    initial={{
                                        opacity: 0,
                                        x: 30,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: index * 0.15,
                                        duration: 0.45,
                                    }}
                                    className="group flex items-center gap-4"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent">
                                        <Check
                                            size={18}
                                            className="text-accent transition duration-300 group-hover:text-white"
                                        />
                                    </div>

                                    <span className="text-base font-medium transition duration-300 group-hover:text-primary">
                                        {item}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}

                        <div className="mt-12">
                            <Button size="lg">
                                Learn More
                                <ArrowRight size={18} />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
};

export default LoomifyPromise;
