import products from "../../data/products";
import Container from "../common/Container";
import ProductCard from "../products/ProductCard";
import SectionTitle from "../common/SectionTitle";

const FeaturedProducts = () => {
    return (
        <section className="py-20">
            <Container>
                <SectionTitle
                    subtitle="Featured Collection"
                    title="Trending Products"
                    description="Discover our most loved fashion essentials crafted with premium quality."
                />

                <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default FeaturedProducts;
