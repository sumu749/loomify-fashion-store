import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Container from "../components/common/Container";
import ProductGallery from "../components/product-details/ProductGallery";
import ProductInfo from "../components/product-details/ProductInfo";
import { getProductById } from "../services/productService";
import RelatedProducts from "../components/product-details/RelatedProducts";
import Breadcrumb from "../components/common/Breadcrumb";
import { useEffect, useState } from "react";
import ProductDetailsSkeleton from "../components/skeleton/ProductDetailsSkeleton";

const ProductDetails = () => {
    const { id } = useParams();
    const product = getProductById(id);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    if (!product) {
        return (
            <Container>
                <div className="py-32 text-center">Product Not Found</div>
            </Container>
        );
    }
    if (loading) {
        return <ProductDetailsSkeleton />;
    }

    return (
        <>
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="border-t border-border bg-stone-50 py-20"
            >
                <Container>
                    <Breadcrumb
                        items={[
                            {
                                label: "Home",
                                path: "/",
                            },
                            {
                                label: "Products",
                                path: "/products",
                            },
                            {
                                label: product.name,
                            },
                        ]}
                    />
                    <div className="grid gap-16 lg:grid-cols-2">
                        <ProductGallery product={product} />
                        <ProductInfo product={product} />
                    </div>
                </Container>
            </motion.section>

            <RelatedProducts currentProduct={product} />
        </>
    );
};

export default ProductDetails;
