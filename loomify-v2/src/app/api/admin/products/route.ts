import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ProductVariantInput {
    size: string;
    color: string;
    stock: number;
}

export async function POST(request: Request) {
    try {
        // Check authentication
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

        // Check admin role
        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden",
                },
                { status: 403 },
            );
        }

        // Read request body
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
        } = body as {
            name: string;
            sku: string;
            description: string;
            price: number;
            compareAtPrice: number | null;
            categoryId: string;
            image: string;
            variants: ProductVariantInput[];
            featured: boolean;
            published: boolean;
        };

        // Basic validation
        if (
            !name?.trim() ||
            !sku?.trim() ||
            !description?.trim() ||
            !categoryId ||
            !price
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields",
                },
                { status: 400 },
            );
        }

        if (!Array.isArray(variants) || variants.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "At least one product variant is required",
                },
                { status: 400 },
            );
        }

        // Validate variants
        const hasInvalidVariant = variants.some(
            (variant) =>
                !variant.size?.trim() ||
                !variant.color?.trim() ||
                Number.isNaN(Number(variant.stock)) ||
                Number(variant.stock) < 0,
        );

        if (hasInvalidVariant) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product variant data",
                },
                { status: 400 },
            );
        }

        // Check category
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

        // Generate slug
        const slug = `${name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}-${crypto.randomUUID().slice(0, 8)}`;

        // Create product + images + variants atomically
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

            // Product image
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

            // Product variants
            for (const variant of variants) {
                const colorCode = variant.color
                    .trim()
                    .replace(/\s+/g, "-")
                    .toUpperCase();

                const variantSku = `${sku.trim()}-${colorCode}-${variant.size.trim()}`;

                await tx.productVariant.create({
                    data: {
                        productId: createdProduct.id,
                        sku: variantSku,
                        size: variant.size.trim(),
                        color: variant.color.trim(),
                        stock: Number(variant.stock),
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
