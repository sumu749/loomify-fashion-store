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

        const { name, description, imageUrl } = body as {
            name?: string;
            description?: string | null;
            imageUrl?: string | null;
        };

        if (!name?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Category name is required",
                },
                { status: 400 },
            );
        }

        const slug = name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const existingCategory = await prisma.category.findUnique({
            where: {
                slug,
            },
            select: {
                id: true,
            },
        });

        if (existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A category with this name already exists",
                },
                { status: 409 },
            );
        }

        const category = await prisma.category.create({
            data: {
                name: name.trim(),
                slug,
                description: description?.trim() || null,
                imageUrl: imageUrl?.trim() || null,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Category created successfully",
                data: category,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Failed to create category:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create category",
            },
            { status: 500 },
        );
    }
}
