import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const requireAdmin = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return {
            session: null,
            response: NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 },
            ),
        };
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            id: true,
            role: true,
        },
    });

    if (!user || user.role !== "ADMIN") {
        return {
            session: null,
            response: NextResponse.json(
                {
                    success: false,
                    message: "Forbidden",
                },
                { status: 403 },
            ),
        };
    }

    return {
        session,
        response: null,
    };
};
