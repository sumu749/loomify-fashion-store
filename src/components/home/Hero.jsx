import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "../common/Button";
import Container from "../common/Container";
import heroImage from "../../assets/images/hero.jpg";

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-linear-to-b from-white via-white to-stone-50">
            {/* Background Decoration */}
            <div className="absolute -right-28 top-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl"></div>
            <div className="absolute -left-20 bottom-10 h-60 w-60 rounded-full bg-primary/5 blur-3xl"></div>

            <Container>
                <div className="grid min-h-[calc(100vh-80px)] items-center gap-16 lg:grid-cols-2">
                    {/* ================= Left Content ================= */}

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}

                        <span className="inline-flex items-center rounded-full bg-accent/10 px-5 py-2 text-sm font-medium text-accent">
                            ✨ New Collection 2026
                        </span>

                        {/* Heading */}

                        <h1 className="mt-8 text-5xl font-extrabold leading-tight text-primary md:text-6xl lg:text-7xl">
                            Wear Your
                            <br />
                            Confidence
                        </h1>

                        {/* Description */}

                        <p className="mt-8 max-w-lg text-lg leading-8 text-gray-600">
                            Premium fashion crafted for modern lifestyles.
                            Discover timeless pieces designed to elevate your
                            everyday wardrobe with elegance and comfort.
                        </p>

                        {/* CTA */}

                        <div className="mt-10 flex items-center gap-5">
                            <Button size="lg">
                                Shop Collection
                                <ArrowRight size={18} />
                            </Button>
                        </div>

                        {/* Small Text */}

                        <p className="mt-5 text-sm text-gray-500">
                            Free shipping on orders over $100
                        </p>
                    </motion.div>

                    {/* ================= Right Image ================= */}

                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                        }}
                    >
                        <div className="overflow-hidden rounded-card shadow-card">
                            <img
                                src={heroImage}
                                alt="Loomify Fashion Collection"
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
