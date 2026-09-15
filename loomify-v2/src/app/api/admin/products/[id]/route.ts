import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ProductRouteParams {
    params: Promise<{
        id: string;
    }>;
}

// PUT /api/admin/products/[id]

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

        if (
            !Array.isArray(sizes) ||
            !Array.isArray(colors) ||
            sizes.length === 0 ||
            colors.length === 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "At least one size and one color are required",
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

        const orderedVariantIds = await prisma.orderItem.findMany({
            where: {
                productId: id,
            },
            select: {
                variantId: true,
            },
            distinct: ["variantId"],
        });

        const orderedVariantIdSet = new Set(
            orderedVariantIds.map((item) => item.variantId),
        );

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

            const existingVariants = new Map(
                existingProduct.variants.map((variant) => [
                    `${variant.color.trim().toLowerCase()}-${variant.size.trim().toLowerCase()}`,
                    variant,
                ]),
            );

            const requestedVariantKeys = new Set<string>();

            for (const color of colors) {
                for (const size of sizes) {
                    const normalizedColor = String(color).trim();
                    const normalizedSize = String(size).trim();

                    const variantKey = `${normalizedColor.toLowerCase()}-${normalizedSize.toLowerCase()}`;

                    if (requestedVariantKeys.has(variantKey)) {
                        continue;
                    }

                    requestedVariantKeys.add(variantKey);

                    const existingVariant = existingVariants.get(variantKey);

                    const colorCode = normalizedColor
                        .replace(/\s+/g, "-")
                        .toUpperCase();

                    const variantSku = `${sku.trim()}-${colorCode}-${normalizedSize}`;

                    if (existingVariant) {
                        await tx.productVariant.update({
                            where: {
                                id: existingVariant.id,
                            },
                            data: {
                                sku: variantSku,
                                size: normalizedSize,
                                color: normalizedColor,
                            },
                        });
                    } else {
                        await tx.productVariant.create({
                            data: {
                                productId: id,
                                sku: variantSku,
                                size: normalizedSize,
                                color: normalizedColor,
                                stock: 0,
                            },
                        });
                    }
                }
            }

            for (const variant of existingProduct.variants) {
                const variantKey = `${variant.color.trim().toLowerCase()}-${variant.size.trim().toLowerCase()}`;

                const isRequested = requestedVariantKeys.has(variantKey);
                const wasOrdered = orderedVariantIdSet.has(variant.id);

                if (!isRequested && wasOrdered) {
                    await tx.productVariant.update({
                        where: {
                            id: variant.id,
                        },
                        data: {
                            stock: 0,
                        },
                    });
                }
            }

            for (const variant of existingProduct.variants) {
                const variantKey = `${variant.color.trim().toLowerCase()}-${variant.size.trim().toLowerCase()}`;

                const isRequested = requestedVariantKeys.has(variantKey);
                const wasOrdered = orderedVariantIdSet.has(variant.id);

                if (!isRequested && !wasOrdered) {
                    await tx.productVariant.delete({
                        where: {
                            id: variant.id,
                        },
                    });
                }
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

// PATCH /api/admin/products/[id]

export async function PATCH(request: Request, { params }: ProductRouteParams) {
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

        if (typeof body.published !== "boolean") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Published must be a boolean",
                },
                { status: 400 },
            );
        }

        const product = await prisma.product.update({
            where: {
                id,
            },
            data: {
                published: body.published,
            },
            select: {
                id: true,
                published: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: product.published
                ? "Product published successfully"
                : "Product unpublished successfully",
            data: product,
        });
    } catch (error) {
        console.error("Failed to update product status:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update product status",
            },
            { status: 500 },
        );
    }
}

// DELETE /api/admin/products/[id]

export async function DELETE(
    _request: Request,
    { params }: ProductRouteParams,
) {
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

        const product = await prisma.product.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        orderItems: true,
                    },
                },
            },
        });

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 },
            );
        }

        if (product._count.orderItems > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This product cannot be deleted because it exists in order history.",
                },
                { status: 409 },
            );
        }

        await prisma.$transaction(async (tx) => {
            await tx.cartItem.deleteMany({
                where: {
                    productId: id,
                },
            });

            await tx.wishlistItem.deleteMany({
                where: {
                    productId: id,
                },
            });

            await tx.review.deleteMany({
                where: {
                    productId: id,
                },
            });

            await tx.productImage.deleteMany({
                where: {
                    productId: id,
                },
            });

            await tx.productVariant.deleteMany({
                where: {
                    productId: id,
                },
            });

            const deletedProduct = await tx.product.deleteMany({
                where: {
                    id,
                    orderItems: {
                        none: {},
                    },
                },
            });

            if (deletedProduct.count !== 1) {
                throw new Error(
                    "This product cannot be deleted because it exists in order history.",
                );
            }
        });

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete product:", error);

        if (
            error instanceof Error &&
            error.message ===
                "This product cannot be deleted because it exists in order history."
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: 409 },
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete product",
            },
            { status: 500 },
        );
    }
}
