import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers/productMapper";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
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
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const data = products.map(mapProduct);

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Failed to fetch products:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch products",
            },
            { status: 500 },
        );
    }
}
