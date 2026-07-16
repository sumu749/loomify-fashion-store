import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import products from "../../data/products";
import Container from "../common/Container";
import ProductCard from "../products/ProductCard";
import SectionTitle from "../common/SectionTitle";

const featuredProducts = products.slice(0, 4);

// const cardVariants = [
//     {
//         hidden: { opacity: 0, x: -80 },
//         visible: { opacity: 1, x: 0 },
//     },

//     {
//         hidden: { opacity: 0, y: 80 },
//         visible: { opacity: 1, y: 0 },
//     },

//     {
//         hidden: { opacity: 0, y: -80 },
//         visible: { opacity: 1, y: 0 },
//     },

//     {
//         hidden: { opacity: 0, x: 80 },
//         visible: { opacity: 1, x: 0 },
//     },
// ];

const FeaturedProducts = () => {
    return (
        <section className="relative overflow-hidden py-24">
            {/* Decoration */}

            <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl"></div>

            <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>

            <Container>
                {/* Header */}

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
                >
                    <SectionTitle
                        align="left"
                        subtitle="Featured Collection"
                        title="Our Best Picks"
                        description="Handpicked fashion essentials crafted with premium quality to elevate your everyday wardrobe."
                        descriptionClassName="max-w-xl"
                    />

                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 font-medium text-primary transition hover:text-accent"
                    >
                        View All
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>

                {/* Products */}

                <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {featuredProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className={`
                ${index % 2 !== 0 ? "xl:mt-10" : ""}
            `}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default FeaturedProducts;
