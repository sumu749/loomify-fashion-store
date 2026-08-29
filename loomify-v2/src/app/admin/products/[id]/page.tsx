import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import ProductEditForm from "@/components/admin/ProductEditForm";

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
    const { id } = await params;

    const [product, categories] = await Promise.all([
        prisma.product.findUnique({
            where: {
                id,
            },
            include: {
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
            },
        }),

        prisma.category.findMany({
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        }),
    ]);

    if (!product) {
        notFound();
    }

    const serializedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        description: product.description,

        price: Number(product.price),

        compareAtPrice:
            product.compareAtPrice !== null
                ? Number(product.compareAtPrice)
                : null,

        stock: product.stock,
        featured: product.featured,
        published: product.published,
        categoryId: product.categoryId,

        images: product.images.map((image) => ({
            id: image.id,
            url: image.url,
            alt: image.alt,
            sortOrder: image.sortOrder,
        })),

        variants: product.variants.map((variant) => ({
            id: variant.id,
            sku: variant.sku,
            size: variant.size,
            color: variant.color,

            price: variant.price !== null ? Number(variant.price) : null,

            stock: variant.stock,
        })),
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Catalog
                </p>

                <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                    Edit Product
                </h1>

                <p className="mt-2 text-gray-600">
                    Update product information, pricing and variants.
                </p>
            </div>

            <ProductEditForm
                product={serializedProduct}
                categories={categories}
            />
        </div>
    );
};

export default EditProductPage;
