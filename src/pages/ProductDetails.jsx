import { useParams } from "react-router-dom";
import Container from "../components/common/Container";
import ProductGallery from "../components/product-details/ProductGallery";
import ProductInfo from "../components/product-details/ProductInfo";
import { getProductById } from "../services/productService";

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
        <section className="py-20">
            <Container>
                <div className="grid gap-16 lg:grid-cols-2">
                    <ProductGallery product={product} />

                    <ProductInfo product={product} />
                </div>
            </Container>
        </section>
    );
};

export default ProductDetails;
