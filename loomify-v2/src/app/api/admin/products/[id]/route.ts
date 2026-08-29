import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ProductRouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function PUT(request: Request, { params }: ProductRouteParams) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 },
            );
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden",
                },
                { status: 403 },
            );
        }

        const { id } = await params;

        const body = await request.json();

        const {
            name,
            sku,
            description,
            price,
            compareAtPrice,
            categoryId,
            image,
            variants,
            featured,
            published,
        } = body;

        if (!name || !sku || !description || !categoryId || !price) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields",
                },
                { status: 400 },
            );
        }

        const existingProduct = await prisma.product.findUnique({
            where: {
                id,
            },
            include: {
                variants: true,
                images: true,
            },
        });

        if (!existingProduct) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 },
            );
        }

        const category = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        });

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Category not found",
                },
                { status: 404 },
            );
        }

        await prisma.$transaction(async (tx) => {
            await tx.product.update({
                where: {
                    id,
                },
                data: {
                    name: name.trim(),
                    sku: sku.trim(),
                    description: description.trim(),
                    price,
                    compareAtPrice: compareAtPrice ?? null,
                    categoryId,
                    featured: Boolean(featured),
                    published: Boolean(published),
                },
            });

            if (image?.trim()) {
                const existingImage = existingProduct.images[0];

                if (existingImage) {
                    await tx.productImage.update({
                        where: {
                            id: existingImage.id,
                        },
                        data: {
                            url: image.trim(),
                            alt: name.trim(),
                        },
                    });
                } else {
                    await tx.productImage.create({
                        data: {
                            productId: id,
                            url: image.trim(),
                            alt: name.trim(),
                            sortOrder: 0,
                        },
                    });
                }
            }

            await tx.productVariant.deleteMany({
                where: {
                    productId: id,
                },
            });

            for (const variant of variants) {
                const colorCode = variant.color
                    .trim()
                    .replace(/\s+/g, "-")
                    .toUpperCase();

                const variantSku = `${sku.trim()}-${colorCode}-${variant.size.trim()}`;

                await tx.productVariant.create({
                    data: {
                        productId: id,
                        sku: variantSku,
                        size: variant.size.trim(),
                        color: variant.color.trim(),
                        stock: Number(variant.stock) || 0,
                    },
                });
            }
        });

        return NextResponse.json({
            success: true,
            message: "Product updated successfully",
        });
    } catch (error) {
        console.error("Failed to update product:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update product",
            },
            { status: 500 },
        );
    }
}
