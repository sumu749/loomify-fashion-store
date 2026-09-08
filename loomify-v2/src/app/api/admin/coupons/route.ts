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

        // Read query parameters
        const { searchParams } = new URL(request.url);

        const search = searchParams.get("search")?.trim() || "";
        const status = searchParams.get("status") || "all";
        const type = searchParams.get("type") || "all";
        const sort = searchParams.get("sort") || "newest";

        // Build filters
        const where = {
            ...(search
                ? {
                      code: {
                          contains: search,
                          mode: "insensitive" as const,
                      },
                  }
                : {}),

            ...(status === "active"
                ? { active: true }
                : status === "inactive"
                  ? { active: false }
                  : {}),

            ...(type === "PERCENTAGE"
                ? { type: "PERCENTAGE" as const }
                : type === "FIXED"
                  ? { type: "FIXED" as const }
                  : {}),
        };

        // Build sorting
        let orderBy;

        switch (sort) {
            case "oldest":
                orderBy = {
                    createdAt: "asc" as const,
                };
                break;

            case "highest":
                orderBy = {
                    value: "desc" as const,
                };
                break;

            case "lowest":
                orderBy = {
                    value: "asc" as const,
                };
                break;

            case "newest":
            default:
                orderBy = {
                    createdAt: "desc" as const,
                };
                break;
        }

        const coupons = await prisma.coupon.findMany({
            where,
            orderBy,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Coupons fetched successfully",
                data: coupons,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Failed to fetch coupons:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch coupons",
            },
            { status: 500 },
        );
    }
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
            code,
            type,
            value,
            minOrderAmount,
            maxDiscount,
            usageLimit,
            active,
            expiresAt,
        } = body as {
            code?: string;
            type?: "PERCENTAGE" | "FIXED";
            value?: number;
            minOrderAmount?: number | null;
            maxDiscount?: number | null;
            usageLimit?: number | null;
            active?: boolean;
            expiresAt?: string | null;
        };

        // Basic validation
        if (!code?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Coupon code is required",
                },
                { status: 400 },
            );
        }

        if (!type || !["PERCENTAGE", "FIXED"].includes(type)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid discount type",
                },
                { status: 400 },
            );
        }

        if (
            value === undefined ||
            value === null ||
            Number.isNaN(Number(value)) ||
            Number(value) <= 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Discount value must be greater than 0",
                },
                { status: 400 },
            );
        }

        // Percentage validation
        if (type === "PERCENTAGE" && Number(value) > 100) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Percentage discount cannot exceed 100",
                },
                { status: 400 },
            );
        }

        // Validate optional numeric fields
        if (
            minOrderAmount !== undefined &&
            minOrderAmount !== null &&
            (Number.isNaN(Number(minOrderAmount)) || Number(minOrderAmount) < 0)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid minimum order amount",
                },
                { status: 400 },
            );
        }

        if (
            maxDiscount !== undefined &&
            maxDiscount !== null &&
            (Number.isNaN(Number(maxDiscount)) || Number(maxDiscount) <= 0)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid maximum discount",
                },
                { status: 400 },
            );
        }

        if (
            usageLimit !== undefined &&
            usageLimit !== null &&
            (!Number.isInteger(Number(usageLimit)) || Number(usageLimit) <= 0)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Usage limit must be a positive integer",
                },
                { status: 400 },
            );
        }

        // Validate expiry date
        let parsedExpiresAt: Date | null = null;

        if (expiresAt) {
            parsedExpiresAt = new Date(expiresAt);

            if (Number.isNaN(parsedExpiresAt.getTime())) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid expiry date",
                    },
                    { status: 400 },
                );
            }
        }

        // Normalize coupon code
        const normalizedCode = code.trim().toUpperCase();

        // Check duplicate coupon code
        const existingCoupon = await prisma.coupon.findUnique({
            where: {
                code: normalizedCode,
            },
            select: {
                id: true,
            },
        });

        if (existingCoupon) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A coupon with this code already exists",
                },
                { status: 409 },
            );
        }

        // Create coupon
        const coupon = await prisma.coupon.create({
            data: {
                code: normalizedCode,
                type,
                value: Number(value),
                minOrderAmount:
                    minOrderAmount !== undefined && minOrderAmount !== null
                        ? Number(minOrderAmount)
                        : null,
                maxDiscount:
                    maxDiscount !== undefined && maxDiscount !== null
                        ? Number(maxDiscount)
                        : null,
                usageLimit:
                    usageLimit !== undefined && usageLimit !== null
                        ? Number(usageLimit)
                        : null,
                active: active ?? true,
                expiresAt: parsedExpiresAt,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Coupon created successfully",
                data: coupon,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Failed to create coupon:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create coupon",
            },
            { status: 500 },
        );
    }
}
