"use client";

import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import ProductCard from "@/components/products/ProductCard";
import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton";

import useRelatedProducts from "@/hooks/useRelatedProducts";
import type { Product } from "@/types/product";

interface RelatedProductsProps {
    currentProduct: Product;
}

const RelatedProducts = ({ currentProduct }: RelatedProductsProps) => {
    const {
        data: relatedProducts = [],
        isLoading,
        isError,
    } = useRelatedProducts(currentProduct.slug);

    if (isLoading) {
        return (
            <section className="border-t border-border bg-stone-50 py-20">
                <Container>
                    <SectionTitle
                        subtitle="You May Also Like"
                        title="Complete Your Look"
                        description="Hand-picked pieces that perfectly complement your style."
                    />

                    <div className="mt-14">
                        <ProductGridSkeleton />
                    </div>
                </Container>
            </section>
        );
    }

    if (isError || relatedProducts.length === 0) {
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
