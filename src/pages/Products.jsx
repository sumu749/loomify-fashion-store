import Container from "../components/common/Container";
import ProductGrid from "../components/products/ProductGrid";
import useProducts from "../hooks/useProducts";

const Products = () => {
    const products = useProducts();

    return (
        <section className="py-24">
            <Container>
                <h1 className="text-5xl font-bold text-primary">
                    All Products
                </h1>

                <p className="mt-4 max-w-xl text-gray-600">
                    Discover our curated collection of premium fashion
                    essentials.
                </p>

                <div className="mt-14">
                    <ProductGrid products={products} />
                </div>
            </Container>
        </section>
    );
};

export default Products;
