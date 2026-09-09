/* eslint-disable indent */
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
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

        const { searchParams } = new URL(request.url);

        const search = searchParams.get("search")?.trim() ?? "";
        const status = searchParams.get("status") ?? "all";
        const rating = searchParams.get("rating") ?? "all";
        const sort = searchParams.get("sort") ?? "newest";

        const where = {
            ...(search
                ? {
                      OR: [
                          {
                              comment: {
                                  contains: search,
                                  mode: "insensitive" as const,
                              },
                          },
                          {
                              user: {
                                  name: {
                                      contains: search,
                                      mode: "insensitive" as const,
                                  },
                              },
                          },
                          {
                              user: {
                                  email: {
                                      contains: search,
                                      mode: "insensitive" as const,
                                  },
                              },
                          },
                          {
                              product: {
                                  name: {
                                      contains: search,
                                      mode: "insensitive" as const,
                                  },
                              },
                          },
                      ],
                  }
                : {}),

            ...(status === "approved"
                ? { approved: true }
                : status === "pending"
                  ? { approved: false }
                  : {}),

            ...(["1", "2", "3", "4", "5"].includes(rating)
                ? { rating: Number(rating) }
                : {}),
        };

        const orderBy =
            sort === "oldest"
                ? { createdAt: "asc" as const }
                : sort === "highest"
                  ? { rating: "desc" as const }
                  : sort === "lowest"
                    ? { rating: "asc" as const }
                    : { createdAt: "desc" as const };

        const reviews = await prisma.review.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Reviews fetched successfully",
                data: reviews,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Failed to fetch reviews:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch reviews",
            },
            { status: 500 },
        );
    }
}
