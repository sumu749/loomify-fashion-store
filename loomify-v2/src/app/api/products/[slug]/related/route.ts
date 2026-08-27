import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers/productMapper";

interface RelatedProductsRouteParams {
    params: Promise<{
        slug: string;
    }>;
}

export async function GET(
    _request: Request,
    { params }: RelatedProductsRouteParams,
) {
    try {
        const { slug } = await params;

        const currentProduct = await prisma.product.findUnique({
            where: {
                slug,
            },
            select: {
                id: true,
                categoryId: true,
            },
        });

        if (!currentProduct) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 },
            );
        }

        const relatedProducts = await prisma.product.findMany({
            where: {
                categoryId: currentProduct.categoryId,
                id: {
                    not: currentProduct.id,
                },
                published: true,
            },
            include: {
                category: true,
                images: {
                    orderBy: {
                        sortOrder: "asc",
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
            take: 4,
            orderBy: {
                createdAt: "desc",
            },
        });

        const data = relatedProducts.map(mapProduct);

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Failed to fetch related products:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch related products",
            },
            { status: 500 },
        );
    }
}
