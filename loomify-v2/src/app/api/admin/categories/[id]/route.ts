import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface CategoryRouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function PUT(request: Request, { params }: CategoryRouteParams) {
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

        const category = await prisma.category.findUnique({
            where: {
                id,
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

        const slug = name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const duplicate = await prisma.category.findFirst({
            where: {
                slug,
                id: {
                    not: id,
                },
            },
            select: {
                id: true,
            },
        });

        if (duplicate) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A category with this name already exists",
                },
                { status: 409 },
            );
        }

        const updatedCategory = await prisma.category.update({
            where: {
                id,
            },
            data: {
                name: name.trim(),
                slug,
                description: description?.trim() || null,
                imageUrl: imageUrl?.trim() || null,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    } catch (error) {
        console.error("Failed to update category:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update category",
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: CategoryRouteParams,
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

        const category = await prisma.category.findUnique({
            where: {
                id,
            },
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
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

        if (category._count.products > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This category cannot be deleted because it has products.",
                },
                { status: 409 },
            );
        }

        await prisma.category.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete category:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete category",
            },
            { status: 500 },
        );
    }
}
