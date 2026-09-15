import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

interface UserRouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(request: Request, { params }: UserRouteParams) {
    try {
        const adminCheck = await requireAdmin();

        if (adminCheck.response) {
            return adminCheck.response;
        }

        const session = adminCheck.session!;

        const { id } = await params;

        // Prevent admin from changing their own role
        if (id === session.user.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You cannot change your own role.",
                },
                { status: 400 },
            );
        }

        const body = await request.json();

        const role = body.role;

        if (role !== "USER" && role !== "ADMIN") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid role.",
                },
                { status: 400 },
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                role: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found.",
                },
                { status: 404 },
            );
        }

        if (user.role === "ADMIN" && role === "USER") {
            const adminCount = await prisma.user.count({
                where: {
                    role: "ADMIN",
                },
            });

            if (adminCount <= 1) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "You cannot remove the last admin account.",
                    },
                    { status: 409 },
                );
            }
        }

        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                role,
            },
            select: {
                id: true,
                role: true,
            },
        });

        return NextResponse.json({
            success: true,
            message:
                role === "ADMIN"
                    ? "User promoted to admin."
                    : "Admin role removed.",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Failed to update user role:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update user role.",
            },
            { status: 500 },
        );
    }
}
