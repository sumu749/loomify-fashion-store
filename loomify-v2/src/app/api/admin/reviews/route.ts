/* eslint-disable indent */
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const adminCheck = await requireAdmin();

        if (adminCheck.response) {
            return adminCheck.response;
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
