import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Container from "../components/common/Container";
import ProductGallery from "../components/product-details/ProductGallery";
import ProductInfo from "../components/product-details/ProductInfo";
import { getProductById } from "../services/productService";
import RelatedProducts from "../components/product-details/RelatedProducts";

const ProductDetails = () => {
    const { id } = useParams();

    const product = getProductById(id);

    if (!product) {
        return (
            <Container>
                <div className="py-32 text-center">Product Not Found</div>
            </Container>
        );
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
