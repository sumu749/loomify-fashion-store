import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface AddressRouteParams {
    params: Promise<{
        id: string;
    }>;
}

interface AddressInput {
    fullName?: string;
    phone?: string;
    addressLine?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    country?: string;
}

export async function PUT(request: Request, { params }: AddressRouteParams) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first.",
                },
                { status: 401 },
            );
        }

        const { id } = await params;
        const body = (await request.json()) as AddressInput;

        const {
            fullName,
            phone,
            addressLine,
            city,
            district,
            postalCode,
            country,
        } = body;

        if (
            !fullName?.trim() ||
            !phone?.trim() ||
            !addressLine?.trim() ||
            !city?.trim() ||
            !district?.trim() ||
            !postalCode?.trim() ||
            !country?.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All address fields are required.",
                },
                { status: 400 },
            );
        }

        const address = await prisma.address.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!address) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Address not found.",
                },
                { status: 404 },
            );
        }

        const updatedAddress = await prisma.address.update({
            where: {
                id,
            },
            data: {
                fullName: fullName.trim(),
                phone: phone.trim(),
                addressLine: addressLine.trim(),
                city: city.trim(),
                district: district.trim(),
                postalCode: postalCode.trim(),
                country: country.trim(),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Address updated successfully.",
            data: updatedAddress,
        });
    } catch (error) {
        console.error("Failed to update address:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update address.",
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: AddressRouteParams,
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first.",
                },
                { status: 401 },
            );
        }

        const { id } = await params;

        const address = await prisma.address.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
            select: {
                id: true,
            },
        });

        if (!address) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Address not found.",
                },
                { status: 404 },
            );
        }

        await prisma.address.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Address deleted successfully.",
        });
    } catch (error) {
        console.error("Failed to delete address:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete address.",
            },
            { status: 500 },
        );
    }
}
