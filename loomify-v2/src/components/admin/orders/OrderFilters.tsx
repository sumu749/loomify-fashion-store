"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

const statuses: {
    value: OrderStatus;
    label: string;
}[] = [
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
];

const OrderFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
    const status = searchParams.get("status") ?? "ALL";
    const sort = searchParams.get("sort") ?? "newest";

    const updateFilters = (
        nextSearch: string,
        nextStatus: string,
        nextSort: string,
    ) => {
        const params = new URLSearchParams();

        if (nextSearch.trim()) {
            params.set("search", nextSearch.trim());
        }

        if (nextStatus !== "ALL") {
            params.set("status", nextStatus);
        }

        if (nextSort !== "newest") {
            params.set("sort", nextSort);
        }

        const query = params.toString();

        router.push(query ? `/admin/orders?${query}` : "/admin/orders");
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        updateFilters(search, status, sort);
    };

    const handleStatusChange = (value: string) => {
        updateFilters(search, value, sort);
    };

    const handleSortChange = (value: string) => {
        updateFilters(search, status, value);
    };

    const clearFilters = () => {
        setSearch("");

        router.push("/admin/orders");
    };

    const hasActiveFilters =
        Boolean(search.trim()) || status !== "ALL" || sort !== "newest";

    return (
        <div className="space-y-6">
            {/* Search */}

            <form onSubmit={handleSearchSubmit}>
                <label
                    htmlFor="order-search"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                    Search
                </label>

                <div className="relative">
                    <input
                        id="order-search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Order ID, name, email..."
                        className="h-11 w-full rounded-xl border border-border bg-white px-4 pr-10 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-accent"
                    />

                    <button
                        type="submit"
                        aria-label="Search orders"
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
                            name="order-status"
                            checked={status === "ALL"}
                            onChange={() => handleStatusChange("ALL")}
                            className="h-4 w-4 accent-black"
                        />

                        <span className="text-sm text-gray-700">
                            All orders
                        </span>
                    </label>

                    {statuses.map((item) => (
                        <label
                            key={item.value}
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-stone-50"
                        >
                            <input
                                type="radio"
                                name="order-status"
                                value={item.value}
                                checked={status === item.value}
                                onChange={() => handleStatusChange(item.value)}
                                className="h-4 w-4 accent-black"
                            />

                            <span className="text-sm text-gray-700">
                                {item.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Sort */}

            <div>
                <label
                    htmlFor="order-sort"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                    Sort By
                </label>

                <select
                    id="order-sort"
                    value={sort}
                    onChange={(event) => handleSortChange(event.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-primary outline-none transition focus:border-accent"
                >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="highest">Highest total</option>
                    <option value="lowest">Lowest total</option>
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

export default OrderFilters;
