import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
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

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Coupon ID is required",
                },
                { status: 400 },
            );
        }

        const coupon = await prisma.coupon.findUnique({
            where: {
                id,
            },
        });

        if (!coupon) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Coupon not found",
                },
                { status: 404 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Coupon fetched successfully",
                data: coupon,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Failed to fetch coupon:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch coupon",
            },
            { status: 500 },
        );
    }
}

export async function PUT(request: Request, { params }: RouteContext) {
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

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Coupon ID is required",
                },
                { status: 400 },
            );
        }

        // Check existing coupon
        const existingCoupon = await prisma.coupon.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                code: true,
                usedCount: true,
            },
        });

        if (!existingCoupon) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Coupon not found",
                },
                { status: 404 },
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

        if (type === "PERCENTAGE" && Number(value) > 100) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Percentage discount cannot exceed 100",
                },
                { status: 400 },
            );
        }

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

        // Prevent lowering usage limit below current usage.
        if (
            usageLimit !== undefined &&
            usageLimit !== null &&
            Number(usageLimit) < existingCoupon.usedCount
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Usage limit cannot be less than current usage (${existingCoupon.usedCount})`,
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
        const duplicateCoupon = await prisma.coupon.findFirst({
            where: {
                code: normalizedCode,
                NOT: {
                    id,
                },
            },
            select: {
                id: true,
            },
        });

        if (duplicateCoupon) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A coupon with this code already exists",
                },
                { status: 409 },
            );
        }

        // Update coupon
        const coupon = await prisma.coupon.update({
            where: {
                id,
            },
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
                message: "Coupon updated successfully",
                data: coupon,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Failed to update coupon:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update coupon",
            },
            { status: 500 },
        );
    }
}
