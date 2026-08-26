import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import ProductCard from "@/components/products/ProductCard";

import products from "@/data/products";
import type { Product } from "@/types/product";

interface RelatedProductsProps {
    currentProduct: Product;
}

const RelatedProducts = ({ currentProduct }: RelatedProductsProps) => {
    const relatedProducts = products
        .filter(
            (product) =>
                product.category === currentProduct.category &&
                product.id !== currentProduct.id,
        )
        .slice(0, 4);

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className="border-t border-border bg-stone-50 py-20">
            <Container>
                <SectionTitle
                    subtitle="You May Also Like"
                    title="Complete Your Look"
                    description="Hand-picked pieces that perfectly complement your style."
                />

                <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {relatedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default RelatedProducts;
