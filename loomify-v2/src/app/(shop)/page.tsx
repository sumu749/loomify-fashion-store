import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import LoomifyPromise from "@/components/home/LoomifyPromise";
import Newsletter from "@/components/home/Newsletter";
import StatsSection from "@/components/home/StatsSection";

import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers/productMapper";

export default async function HomePage() {
    const featuredProductsFromDb = await prisma.product.findMany({
        where: {
            published: true,
            featured: true,
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
        orderBy: {
            createdAt: "desc",
        },
        take: 4,
    });

    const featuredProducts = featuredProductsFromDb.map(mapProduct);

    return (
        <>
            <Hero />

            <Categories />

            <FeaturedProducts products={featuredProducts} />

            <LoomifyPromise />

            <StatsSection />

            <Newsletter />
        </>
    );
}
