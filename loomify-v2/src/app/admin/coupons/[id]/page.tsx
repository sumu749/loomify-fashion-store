import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import CouponEditForm from "@/components/admin/coupons/CouponEditForm";

interface EditCouponPageProps {
    params: Promise<{
        id: string;
    }>;
}

const EditCouponPage = async ({ params }: EditCouponPageProps) => {
    const { id } = await params;

    const coupon = await prisma.coupon.findUnique({
        where: {
            id,
        },
    });

    if (!coupon) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Store Management
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                    Edit Coupon
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                    Update the discount rules, usage limits, and availability of
                    this coupon.
                </p>
            </div>

            <CouponEditForm
                coupon={{
                    id: coupon.id,
                    code: coupon.code,
                    type: coupon.type,
                    value: coupon.value.toString(),
                    minOrderAmount: coupon.minOrderAmount?.toString() ?? "",
                    maxDiscount: coupon.maxDiscount?.toString() ?? "",
                    usageLimit: coupon.usageLimit?.toString() ?? "",
                    usedCount: coupon.usedCount,
                    active: coupon.active,
                    expiresAt: coupon.expiresAt
                        ? coupon.expiresAt.toISOString().slice(0, 10)
                        : "",
                }}
            />
        </div>
    );
};

export default EditCouponPage;
