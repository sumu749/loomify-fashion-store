import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface AddressInput {
    fullName?: string;
    phone?: string;
    addressLine?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    country?: string;
}

export async function POST(request: Request) {
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

        const address = await prisma.address.create({
            data: {
                userId: session.user.id,
                fullName: fullName.trim(),
                phone: phone.trim(),
                addressLine: addressLine.trim(),
                city: city.trim(),
                district: district.trim(),
                postalCode: postalCode.trim(),
                country: country.trim(),
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Address created successfully.",
                data: address,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Failed to create address:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create address.",
            },
            { status: 500 },
        );
    }
}
