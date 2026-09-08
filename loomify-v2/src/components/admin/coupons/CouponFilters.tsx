"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type CouponStatus = "all" | "active" | "inactive";
type CouponType = "all" | "PERCENTAGE" | "FIXED";

const CouponFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        () => searchParams.get("search") ?? "",
    );

    const status = (searchParams.get("status") as CouponStatus) || "all";

    const type = (searchParams.get("type") as CouponType) || "all";

    const sort = searchParams.get("sort") ?? "newest";

    const updateFilters = (
        nextSearch: string,
        nextStatus: CouponStatus,
        nextType: CouponType,
        nextSort: string,
    ) => {
        const params = new URLSearchParams();

        if (nextSearch.trim()) {
            params.set("search", nextSearch.trim());
        }

        if (nextStatus !== "all") {
            params.set("status", nextStatus);
        }

        if (nextType !== "all") {
            params.set("type", nextType);
        }

        if (nextSort !== "newest") {
            params.set("sort", nextSort);
        }

        const query = params.toString();

        router.push(query ? `/admin/coupons?${query}` : "/admin/coupons");
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        updateFilters(search, status, type, sort);
    };

    const handleStatusChange = (value: CouponStatus) => {
        updateFilters(search, value, type, sort);
    };

    const handleTypeChange = (value: CouponType) => {
        updateFilters(search, status, value, sort);
    };

    const handleSortChange = (value: string) => {
        updateFilters(search, status, type, value);
    };

    const clearFilters = () => {
        setSearch("");

        router.push("/admin/coupons");
    };

    const hasActiveFilters =
        Boolean(search.trim()) ||
        status !== "all" ||
        type !== "all" ||
        sort !== "newest";

    return (
        <div className="space-y-6">
            {/* Search */}

            <form onSubmit={handleSearchSubmit}>
                <label
                    htmlFor="coupon-search"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                    Search
                </label>

                <div className="relative">
                    <input
                        id="coupon-search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Coupon code..."
                        className="h-11 w-full rounded-xl border border-border bg-white px-4 pr-10 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-accent"
                    />

                    <button
                        type="submit"
                        aria-label="Search coupons"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-primary"
                    >
                        ↵
                    </button>
                </div>
            </form>

            {/* Status */}

            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                </p>

                <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-stone-50">
                        <input
                            type="radio"
                            name="coupon-status"
                            checked={status === "all"}
                            onChange={() => handleStatusChange("all")}
                            className="h-4 w-4 accent-black"
                        />

                        <span className="text-sm text-gray-700">
                            All coupons
                        </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-stone-50">
                        <input
                            type="radio"
                            name="coupon-status"
                            checked={status === "active"}
                            onChange={() => handleStatusChange("active")}
                            className="h-4 w-4 accent-black"
                        />

                        <span className="text-sm text-gray-700">Active</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-stone-50">
                        <input
                            type="radio"
                            name="coupon-status"
                            checked={status === "inactive"}
                            onChange={() => handleStatusChange("inactive")}
                            className="h-4 w-4 accent-black"
                        />

                        <span className="text-sm text-gray-700">Inactive</span>
                    </label>
                </div>
            </div>

            {/* Discount Type */}

            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Discount Type
                </p>

                <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-stone-50">
                        <input
                            type="radio"
                            name="coupon-type"
                            checked={type === "all"}
                            onChange={() => handleTypeChange("all")}
                            className="h-4 w-4 accent-black"
                        />

                        <span className="text-sm text-gray-700">All types</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-stone-50">
                        <input
                            type="radio"
                            name="coupon-type"
                            checked={type === "PERCENTAGE"}
                            onChange={() => handleTypeChange("PERCENTAGE")}
                            className="h-4 w-4 accent-black"
                        />

                        <span className="text-sm text-gray-700">
                            Percentage
                        </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-stone-50">
                        <input
                            type="radio"
                            name="coupon-type"
                            checked={type === "FIXED"}
                            onChange={() => handleTypeChange("FIXED")}
                            className="h-4 w-4 accent-black"
                        />

                        <span className="text-sm text-gray-700">
                            Fixed amount
                        </span>
                    </label>
                </div>
            </div>

            {/* Sort */}

            <div>
                <label
                    htmlFor="coupon-sort"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                    Sort By
                </label>

                <select
                    id="coupon-sort"
                    value={sort}
                    onChange={(event) => handleSortChange(event.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-primary outline-none transition focus:border-accent"
                >
                    <option value="newest">Newest first</option>

                    <option value="oldest">Oldest first</option>

                    <option value="highest">Highest value</option>

                    <option value="lowest">Lowest value</option>
                </select>
            </div>

            {/* Clear */}

            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-primary hover:bg-stone-50 hover:text-primary"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );
};

export default CouponFilters;
