import Categories from "@/components/home/Categories";
import TopProducts from "@/components/home/TopProducts";
import Hero from "@/components/home/Hero";
import LoomifyPromise from "@/components/home/LoomifyPromise";
import Newsletter from "@/components/home/Newsletter";

import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers/productMapper";
import EditorialCampaigns from "@/components/home/EditorialCampaigns";
import LatestProducts from "@/components/home/LatestProducts";
import BenefitsSection from "@/components/home/BenefitsSection";

export default async function HomePage() {
    const topProducts = await prisma.product.findMany({
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
            variants: true,
            reviews: {
                where: {
                    approved: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 8,
    });

    const latestProducts = await prisma.product.findMany({
        where: {
            published: true,
        },
        include: {
            category: true,
            images: {
                orderBy: {
                    sortOrder: "asc",
                },
            },
            variants: true,
            reviews: {
                where: {
                    approved: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 4,
    });

    const mappedTopProducts = topProducts.map(mapProduct);
    const mappedLatestProducts = latestProducts.map(mapProduct);

    return (
        <>
            <Hero />

            <Categories />

            <LatestProducts products={mappedLatestProducts} />

            <TopProducts products={mappedTopProducts} />

            <EditorialCampaigns />

            <LoomifyPromise />

            <BenefitsSection />

            <Newsletter />
        </>
    );
}
