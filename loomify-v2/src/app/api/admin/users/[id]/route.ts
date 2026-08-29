import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface UserRouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(request: Request, { params }: UserRouteParams) {
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
