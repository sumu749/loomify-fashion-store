import { notFound } from "next/navigation";

import Breadcrumb from "@/components/common/Breadcrumb";
import Container from "@/components/common/Container";
import ProductGallery from "@/components/product-details/ProductGallery";
import ProductInfo from "@/components/product-details/ProductInfo";
import RelatedProducts from "@/components/product-details/RelatedProducts";

import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers/productMapper";

interface ProductDetailsPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductDetailsPage({
    params,
}: ProductDetailsPageProps) {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
        where: {
            slug,
        },
        include: {
            category: true,

            images: {
                orderBy: {
                    sortOrder: "asc",
                },
            },

            variants: {
                orderBy: {
                    createdAt: "asc",
                },
            },

            reviews: {
                where: {
                    approved: true,
                },
                select: {
                    rating: true,
                },
            },
        },
    });

    if (!product || !product.published) {
        notFound();
    }

    const mappedProduct = mapProduct(product);

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
                                label: mappedProduct.name,
                            },
                        ]}
                    />

                    <div className="grid gap-16 lg:grid-cols-2">
                        <ProductGallery product={mappedProduct} />

                        <ProductInfo product={mappedProduct} />
                    </div>
                </Container>
            </section>

            <RelatedProducts currentProduct={mappedProduct} />
        </>
    );
}
