import type { Product } from "@/types/product";

interface PrismaProductImage {
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
}

interface PrismaCategory {
    id: string;
    name: string;
    slug: string;
}

interface PrismaProduct {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string;
    price: unknown;
    compareAtPrice: unknown;
    stock: number;
    featured: boolean;
    published: boolean;
    category: PrismaCategory;
    images: PrismaProductImage[];
    reviews: PrismaProductReview[];
}

interface PrismaProductReview {
    rating: number;
}

export const mapProduct = (product: PrismaProduct): Product => {
    const images = product.images
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((image) => image.url);

    const totalReviews = product.reviews.length;

    const averageRating =
        totalReviews > 0
            ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews
            : 0;

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        description: product.description,

        price: Number(product.price),

        oldPrice:
            product.compareAtPrice !== null
                ? Number(product.compareAtPrice)
                : undefined,

        category: product.category.name,

        image: images[0] ?? "",
        images,

        stock: product.stock,
        featured: product.featured,
        published: product.published,

        rating: Number(averageRating.toFixed(1)),
        reviews: totalReviews,

        badge: "",

        colors: [],
        sizes: [],
    };
};
