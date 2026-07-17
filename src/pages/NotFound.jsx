import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

import Container from "../components/common/Container";
import Button from "../components/common/Button";

const NotFound = () => {
    return (
        <section className="relative flex min-h-screen items-center overflow-hidden bg-background">
            {/* Background Decoration */}

            <div className="absolute -left-28 top-16 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

            <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-2xl text-center"
                >
                    {/* 404 */}

                    <motion.h1
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{
                            duration: 0.5,
                        }}
                        className="text-7xl font-extrabold tracking-tight text-accent sm:text-8xl md:text-9xl"
                    >
                        404
                    </motion.h1>

                    {/* Heading */}

                    <h2 className="mt-6 text-3xl font-bold text-primary md:text-5xl">
                        Page Not Found
                    </h2>

                    {/* Description */}

                    <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-gray-600 md:text-lg">
                        Sorry, the page you are looking for doesn't exist, may
                        have been moved, or the URL might be incorrect.
                    </p>

                    {/* Buttons */}

                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                        <Link to="/">
                            <Button size="lg">
                                <Home size={18} />
                                Back Home
                            </Button>
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-card
                                border
                                border-border
                                px-6
                                py-3
                                font-medium
                                transition-all
                                duration-300
                                hover:border-accent
                                hover:text-accent
                            "
                        >
                            <ArrowLeft size={18} />
                            Go Back
                        </button>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
};

export default NotFound;
