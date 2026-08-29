import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
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

        const body = await request.json();

        const {
            name,
            sku,
            description,
            price,
            compareAtPrice,
            variants,
            categoryId,
            image,
            sizes,
            colors,
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

        const slug = `${name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}-${crypto.randomUUID().slice(0, 8)}`;

        const product = await prisma.$transaction(async (tx) => {
            const createdProduct = await tx.product.create({
                data: {
                    name: name.trim(),
                    slug,
                    sku: sku.trim(),
                    description: description.trim(),
                    price,
                    compareAtPrice: compareAtPrice ?? null,

                    featured: Boolean(featured),
                    published: Boolean(published),
                    categoryId,
                },
            });

            if (image?.trim()) {
                await tx.productImage.create({
                    data: {
                        productId: createdProduct.id,
                        url: image.trim(),
                        alt: name.trim(),
                        sortOrder: 0,
                    },
                });
            }

            for (const color of colors) {
                for (const size of sizes) {
                    const colorCode = color.replace(/\s+/g, "-").toUpperCase();

                    const variantSku = `${sku.trim()}-${colorCode}-${size}`;

                    await tx.productVariant.create({
                        data: {
                            productId: createdProduct.id,
                            sku: variantSku,
                            size,
                            color,
                        },
                    });
                }
            }

            for (const variant of variants) {
                const colorCode = variant.color
                    .replace(/\s+/g, "-")
                    .toUpperCase();

                const variantSku = `${sku.trim()}-${colorCode}-${variant.size}`;

                await tx.productVariant.create({
                    data: {
                        productId: createdProduct.id,
                        sku: variantSku,
                        size: variant.size,
                        color: variant.color,
                        stock: Number(variant.stock) || 0,
                    },
                });
            }

            return createdProduct;
        });

        return NextResponse.json(
            {
                success: true,
                message: "Product created successfully",
                data: {
                    id: product.id,
                    slug: product.slug,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Failed to create product:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create product",
            },
            { status: 500 },
        );
    }
}
