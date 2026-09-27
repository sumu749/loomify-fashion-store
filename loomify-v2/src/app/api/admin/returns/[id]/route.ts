import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";

type ReturnRequestStatus =
    | "REQUESTED"
    | "APPROVED"
    | "REJECTED"
    | "RECEIVED"
    | "COMPLETED";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

const validStatuses: ReturnRequestStatus[] = [
    "REQUESTED",
    "APPROVED",
    "REJECTED",
    "RECEIVED",
    "COMPLETED",
];

const allowedTransitions: Record<ReturnRequestStatus, ReturnRequestStatus[]> = {
    REQUESTED: ["APPROVED", "REJECTED"],
    APPROVED: ["RECEIVED"],
    REJECTED: [],
    RECEIVED: ["COMPLETED"],
    COMPLETED: [],
};

export async function PATCH(request: Request, { params }: RouteContext) {
    try {
        const adminCheck = await requireAdmin();

        if (adminCheck.response) {
            return adminCheck.response;
        }

        const { id } = await params;
        const body = await request.json();
        const status = body?.status as ReturnRequestStatus;
        const adminNote =
            typeof body?.adminNote === "string" ? body.adminNote.trim() : "";

        if (!validStatuses.includes(status) || adminNote.length > 1000) {
            return NextResponse.json(
                { success: false, message: "Invalid return request update." },
                { status: 400 },
            );
        }

        const existingRequest = await prisma.returnRequest.findUnique({
            where: { id },
            select: { id: true, status: true },
        });

        if (!existingRequest) {
            return NextResponse.json(
                { success: false, message: "Return request not found." },
                { status: 404 },
            );
        }

        if (
            status !== existingRequest.status &&
            !allowedTransitions[existingRequest.status].includes(status)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Request cannot move from ${existingRequest.status} to ${status}.`,
                },
                { status: 400 },
            );
        }

        const updated = await prisma.returnRequest.updateMany({
            where: { id, status: existingRequest.status },
            data: { status, adminNote: adminNote || null },
        });

        if (updated.count !== 1) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This request changed before it could be updated.",
                },
                { status: 409 },
            );
        }

        return NextResponse.json({
            success: true,
            message: "Return request updated successfully.",
        });
    } catch (error) {
        console.error("Failed to update return request:", error);

        return NextResponse.json(
            { success: false, message: "Unable to update return request." },
            { status: 500 },
        );
    }
}
