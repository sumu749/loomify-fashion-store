/* eslint-disable indent */
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AdminFilterSidebar from "@/components/admin/filters/AdminFilterSidebar";
import Button from "@/components/common/Button";
import formatCurrency from "@/utils/formatCurrency";
import CouponFilters from "@/components/admin/coupons/CouponFilters";

interface AdminCouponsPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
        type?: string;
        sort?: string;
    }>;
}

const AdminCouponsPage = async ({ searchParams }: AdminCouponsPageProps) => {
    const params = await searchParams;

    const search = params.search?.trim() ?? "";
    const status = params.status ?? "all";
    const type = params.type ?? "all";
    const sort = params.sort ?? "newest";

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

    const orderBy =
        sort === "oldest"
            ? { createdAt: "asc" as const }
            : sort === "highest"
              ? { value: "desc" as const }
              : sort === "lowest"
                ? { value: "asc" as const }
                : { createdAt: "desc" as const };

    const coupons = await prisma.coupon.findMany({
        where,
        orderBy,
    });

    /*
     * Overview stats
     */
    const totalCoupons = coupons.length;

    const activeCoupons = coupons.filter((coupon) => coupon.active).length;

    const inactiveCoupons = coupons.filter((coupon) => !coupon.active).length;

    const percentageCoupons = coupons.filter(
        (coupon) => coupon.type === "PERCENTAGE",
    ).length;

    return (
        <div className="mx-auto max-w-7xl">
            {/* ================= Header ================= */}

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        Store Management
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Coupons
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                        Create and manage discount coupons, usage limits, and
                        promotional offers.
                    </p>
                </div>

                <Button asChild>
                    <Link href="/admin/coupons/new">
                        <Plus size={18} />
                        Add Coupon
                    </Link>
                </Button>
            </div>

            {/* ================= Overview ================= */}

            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Coupons
                    </p>

                    <p className="mt-3 text-2xl font-bold text-primary">
                        {totalCoupons}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Matching current filters
                    </p>
                </div>

                <div className="rounded-2xl border border-green-100 bg-green-50/40 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-600">
                        Active
                    </p>

                    <p className="mt-3 text-2xl font-bold text-green-800">
                        {activeCoupons}
                    </p>

                    <p className="mt-1 text-xs text-green-700/70">
                        Currently available
                    </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">
                        Inactive
                    </p>

                    <p className="mt-3 text-2xl font-bold text-amber-800">
                        {inactiveCoupons}
                    </p>

                    <p className="mt-1 text-xs text-amber-700/70">
                        Disabled coupons
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Percentage
                    </p>

                    <p className="mt-3 text-2xl font-bold text-primary">
                        {percentageCoupons}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Percentage-based discounts
                    </p>
                </div>
            </div>

            {/* ================= Filters + Coupons ================= */}

            <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
                {/* Filter Sidebar */}

                <AdminFilterSidebar>
                    <CouponFilters />
                </AdminFilterSidebar>

                {/* Coupons */}

                <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                    {/* Section Header */}

                    <div className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                Promotion Management
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Coupon Inventory
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500">
                            {totalCoupons}{" "}
                            {totalCoupons === 1 ? "coupon" : "coupons"} found
                        </p>
                    </div>

                    {coupons.length > 0 ? (
                        <>
                            <div className="hidden overflow-x-auto sm:block">
                                <table className="w-full min-w-225">
                                    <thead className="border-b border-border bg-stone-50/80">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Coupon
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Discount
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Usage
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Status
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Expiry
                                            </th>

                                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-border">
                                        {coupons.map((coupon) => {
                                            const isExpired =
                                                coupon.expiresAt &&
                                                new Date(coupon.expiresAt) <
                                                    new Date();

                                            const usagePercentage =
                                                coupon.usageLimit &&
                                                coupon.usageLimit > 0
                                                    ? Math.min(
                                                          (coupon.usedCount /
                                                              coupon.usageLimit) *
                                                              100,
                                                          100,
                                                      )
                                                    : null;

                                            return (
                                                <tr
                                                    key={coupon.id}
                                                    className="group transition hover:bg-stone-50/60"
                                                >
                                                    {/* Coupon */}

                                                    <td className="px-6 py-5">
                                                        <div className="min-w-0">
                                                            <p className="font-semibold tracking-wide text-primary">
                                                                {coupon.code}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-400">
                                                                {coupon.type ===
                                                                "PERCENTAGE"
                                                                    ? "Percentage discount"
                                                                    : "Fixed discount"}
                                                            </p>
                                                        </div>
                                                    </td>

                                                    {/* Discount */}

                                                    <td className="px-6 py-5">
                                                        <div>
                                                            <p className="text-sm font-semibold text-primary">
                                                                {coupon.type ===
                                                                "PERCENTAGE"
                                                                    ? `${Number(
                                                                          coupon.value,
                                                                      )}%`
                                                                    : formatCurrency(
                                                                          Number(
                                                                              coupon.value,
                                                                          ),
                                                                      )}
                                                            </p>

                                                            {coupon.minOrderAmount && (
                                                                <p className="mt-1 text-xs text-gray-400">
                                                                    Min. order{" "}
                                                                    {formatCurrency(
                                                                        Number(
                                                                            coupon.minOrderAmount,
                                                                        ),
                                                                    )}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Usage */}

                                                    <td className="px-6 py-5">
                                                        <p className="text-sm font-semibold text-primary">
                                                            {coupon.usedCount}
                                                            {coupon.usageLimit
                                                                ? ` / ${coupon.usageLimit}`
                                                                : ""}
                                                        </p>

                                                        {usagePercentage !==
                                                            null && (
                                                            <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-stone-100">
                                                                <div
                                                                    className="h-full rounded-full bg-primary"
                                                                    style={{
                                                                        width: `${usagePercentage}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Status */}

                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col items-start gap-1.5">
                                                            <span
                                                                className={`inline-flex rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                                                                    coupon.active &&
                                                                    !isExpired
                                                                        ? "bg-green-50 text-green-700"
                                                                        : "bg-red-50 text-red-700"
                                                                }`}
                                                            >
                                                                {coupon.active &&
                                                                !isExpired
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </span>

                                                            {isExpired && (
                                                                <span className="text-[11px] text-red-500">
                                                                    Expired
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Expiry */}

                                                    <td className="px-6 py-5">
                                                        <p className="text-sm text-gray-600">
                                                            {coupon.expiresAt
                                                                ? new Date(
                                                                      coupon.expiresAt,
                                                                  ).toLocaleDateString(
                                                                      "en-US",
                                                                      {
                                                                          year: "numeric",
                                                                          month: "short",
                                                                          day: "numeric",
                                                                      },
                                                                  )
                                                                : "No expiry"}
                                                        </p>
                                                    </td>

                                                    {/* Actions */}

                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                asChild
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                <Link
                                                                    href={`/admin/coupons/${coupon.id}`}
                                                                >
                                                                    Manage
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Coupon Cards */}

                            <div className="space-y-3 p-4 sm:hidden">
                                {coupons.map((coupon) => {
                                    const isExpired =
                                        coupon.expiresAt &&
                                        new Date(coupon.expiresAt) < new Date();

                                    const usagePercentage =
                                        coupon.usageLimit &&
                                        coupon.usageLimit > 0
                                            ? Math.min(
                                                  (coupon.usedCount /
                                                      coupon.usageLimit) *
                                                      100,
                                                  100,
                                              )
                                            : null;

                                    const isAvailable =
                                        coupon.active && !isExpired;

                                    return (
                                        <div
                                            key={coupon.id}
                                            className="rounded-xl border border-border p-4"
                                        >
                                            {/* Header */}

                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-bold tracking-wide text-primary">
                                                        {coupon.code}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {coupon.type ===
                                                        "PERCENTAGE"
                                                            ? "Percentage discount"
                                                            : "Fixed discount"}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                        isAvailable
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-red-50 text-red-700"
                                                    }`}
                                                >
                                                    {isAvailable
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </div>

                                            {/* Discount */}

                                            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                                                <div>
                                                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                                        Discount
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-primary">
                                                        {coupon.type ===
                                                        "PERCENTAGE"
                                                            ? `${Number(coupon.value)}%`
                                                            : formatCurrency(
                                                                  Number(
                                                                      coupon.value,
                                                                  ),
                                                              )}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                                        Expiry
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-600">
                                                        {coupon.expiresAt
                                                            ? new Date(
                                                                  coupon.expiresAt,
                                                              ).toLocaleDateString(
                                                                  "en-US",
                                                                  {
                                                                      year: "numeric",
                                                                      month: "short",
                                                                      day: "numeric",
                                                                  },
                                                              )
                                                            : "No expiry"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Usage */}

                                            <div className="mt-4 border-t border-border pt-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                                        Usage
                                                    </p>

                                                    <p className="text-xs font-semibold text-primary">
                                                        {coupon.usedCount}
                                                        {coupon.usageLimit
                                                            ? ` / ${coupon.usageLimit}`
                                                            : " used"}
                                                    </p>
                                                </div>

                                                {usagePercentage !== null && (
                                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
                                                        <div
                                                            className="h-full rounded-full bg-primary"
                                                            style={{
                                                                width: `${usagePercentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Minimum Order */}

                                            {coupon.minOrderAmount && (
                                                <div className="mt-3 text-xs text-gray-500">
                                                    Minimum order:{" "}
                                                    <span className="font-medium text-gray-700">
                                                        {formatCurrency(
                                                            Number(
                                                                coupon.minOrderAmount,
                                                            ),
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Expired */}

                                            {isExpired && (
                                                <p className="mt-2 text-xs font-medium text-red-500">
                                                    This coupon has expired.
                                                </p>
                                            )}

                                            {/* Action */}

                                            <div className="mt-4 flex justify-end border-t border-border pt-4">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/admin/coupons/${coupon.id}`}
                                                    >
                                                        Manage
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="px-6 py-20 text-center sm:px-8">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-xl">
                                🎟️
                            </div>

                            <h3 className="mt-5 text-lg font-semibold text-primary">
                                No matching coupons
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Try adjusting your search or filter options to
                                find the coupons you are looking for.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AdminCouponsPage;
