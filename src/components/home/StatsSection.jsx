import { motion } from "framer-motion";
import { Users, PackageCheck, Star, Truck } from "lucide-react";

import Container from "../common/Container";

const stats = [
    {
        icon: Users,
        value: "20K+",
        label: "Happy Customers",
    },
    {
        icon: PackageCheck,
        value: "500+",
        label: "Premium Products",
    },
    {
        icon: Star,
        value: "4.9★",
        label: "Customer Rating",
    },
    {
        icon: Truck,
        value: "Free",
        label: "Worldwide Shipping",
    },
];

const StatsSection = () => {
    return (
        <section className="bg-primary py-20 text-white">
            <Container>
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.label}
                                initial={{
                                    opacity: 0,
                                    y: 40,
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
                                    delay: index * 0.15,
                                }}
                                className="group text-center"
                            >
                                <div
                                    className="
                                        mx-auto
                                        flex
                                        h-16
                                        w-16
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white/10
                                        transition-all
                                        duration-300
                                        group-hover:scale-110
                                        group-hover:bg-accent
                                    "
                                >
                                    <Icon size={30} />
                                </div>

                                <h3 className="mt-6 text-4xl font-bold">
                                    {item.value}
                                </h3>

                                <p className="mt-2 text-gray-300">
                                    {item.label}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
};

export default StatsSection;
