import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
                    message: "You must be logged in to submit a review",
                },
                { status: 401 },
            );
        }

        // Read request body
        const body = await request.json();

        const { productId, rating, comment } = body as {
            productId?: string;
            rating?: number;
            comment?: string | null;
        };

        // Validate product ID
        if (!productId?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product ID is required",
                },
                { status: 400 },
            );
        }

        // Validate rating
        if (
            rating === undefined ||
            rating === null ||
            !Number.isInteger(Number(rating)) ||
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Rating must be an integer between 1 and 5",
                },
                { status: 400 },
            );
        }

        // Validate comment
        const normalizedComment = comment?.trim() || null;

        if (normalizedComment && normalizedComment.length > 1000) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Review comment cannot exceed 1000 characters",
                },
                { status: 400 },
            );
        }

        // Check product
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
            select: {
                id: true,
                published: true,
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

        if (!product.published) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Reviews cannot be submitted for unpublished products",
                },
                { status: 400 },
            );
        }

        // Check whether this user already reviewed this product
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
            select: {
                id: true,
            },
        });

        if (existingReview) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You have already reviewed this product",
                },
                { status: 409 },
            );
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                productId,
                rating: Number(rating),
                comment: normalizedComment,
                approved: false,
            },
            select: {
                id: true,
                productId: true,
                rating: true,
                comment: true,
                approved: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Review submitted successfully and is awaiting approval",
                data: review,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Failed to create review:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to submit review",
            },
            { status: 500 },
        );
    }
}
