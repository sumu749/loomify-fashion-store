import { motion } from "framer-motion";

const Loader = () => {
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background">
            {/* Background Blur */}

            <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

            <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative flex flex-col items-center">
                {/* Logo */}

                <motion.div
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                    }}
                    className="
                        mb-8
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        border-4
                        border-accent/20
                        border-t-accent
                    "
                >
                    <span className="text-3xl font-bold text-accent">L</span>
                </motion.div>

                {/* Brand */}

                <motion.h2
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="text-3xl font-bold tracking-[0.25em] text-primary"
                >
                    LOOMIFY
                </motion.h2>

                {/* Loading Text */}

                <motion.p
                    animate={{
                        opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                    }}
                    className="mt-4 text-sm uppercase tracking-[0.35em] text-gray-500"
                >
                    Loading...
                </motion.p>
            </div>
        </div>
    );
};

export default Loader;
