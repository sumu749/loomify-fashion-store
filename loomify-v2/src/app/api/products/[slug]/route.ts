import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers/productMapper";

interface ProductRouteParams {
    params: Promise<{
        slug: string;
    }>;
}

export async function GET(_request: Request, { params }: ProductRouteParams) {
    try {
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
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 },
            );
        }

        const data = mapProduct(product);

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Failed to fetch product:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch product",
            },
            { status: 500 },
        );
    }
}
