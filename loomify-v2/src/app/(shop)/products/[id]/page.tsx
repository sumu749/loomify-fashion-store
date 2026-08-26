import { notFound } from "next/navigation";

import Breadcrumb from "@/components/common/Breadcrumb";
import Container from "@/components/common/Container";
import ProductGallery from "@/components/product-details/ProductGallery";
import ProductInfo from "@/components/product-details/ProductInfo";
import RelatedProducts from "@/components/product-details/RelatedProducts";

import { getProductById } from "@/services/productService";

interface ProductDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductDetailsPage({
    params,
}: ProductDetailsPageProps) {
    const { id } = await params;

    const product = getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <>
            <section className="border-t border-border bg-stone-50 py-20">
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
            </section>

            <RelatedProducts currentProduct={product} />
        </>
    );
}
