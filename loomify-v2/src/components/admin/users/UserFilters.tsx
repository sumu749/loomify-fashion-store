"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

import Button from "@/components/common/Button";

const UserFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get("search") ?? "";
    const initialRole = searchParams.get("role") ?? "ALL";
    const initialSort = searchParams.get("sort") ?? "newest";

    const searchInputRef = useRef<HTMLInputElement>(null);

    const applyFilters = (
        nextSearch: string,
        nextRole: string,
        nextSort: string,
    ) => {
        const params = new URLSearchParams();

        if (nextSearch.trim()) {
            params.set("search", nextSearch.trim());
        }

        if (nextRole !== "ALL") {
            params.set("role", nextRole);
        }

        if (nextSort !== "newest") {
            params.set("sort", nextSort);
        }

        const query = params.toString();

        router.push(query ? `/admin/users?${query}` : "/admin/users");
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        applyFilters(
            searchInputRef.current?.value ?? initialSearch,
            initialRole,
            initialSort,
        );
    };

    const handleRoleChange = (value: string) => {
        applyFilters(
            searchInputRef.current?.value ?? initialSearch,
            value,
            initialSort,
        );
    };

    const handleSortChange = (value: string) => {
        applyFilters(
            searchInputRef.current?.value ?? initialSearch,
            initialRole,
            value,
        );
    };

    return (
        <div
            key={`${initialSearch}-${initialRole}-${initialSort}`}
            className="space-y-7"
        >
            {/* Search */}

            <form onSubmit={handleSearchSubmit}>
                <label
                    htmlFor="user-search"
                    className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500"
                >
                    Search
                </label>

                <div className="space-y-3">
                    <input
                        id="user-search"
                        ref={searchInputRef}
                        type="search"
                        defaultValue={initialSearch}
                        placeholder="Name or email..."
                        className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-stone-100"
                    />

                    <Button type="submit" size="sm" className="w-full">
                        Apply Search
                    </Button>
                </div>
            </form>

            {/* Divider */}

            <div className="border-t border-border" />

            {/* Role */}

            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Role
                </p>

                <div className="space-y-1">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-stone-50">
                        <input
                            type="radio"
                            name="user-role"
                            value="ALL"
                            defaultChecked={initialRole === "ALL"}
                            onChange={() => handleRoleChange("ALL")}
                            className="h-4 w-4 accent-black"
                        />

                        <span className="text-sm text-gray-700">All users</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-stone-50">
                        <input
                            type="radio"
                            name="user-role"
                            value="ADMIN"
                            defaultChecked={initialRole === "ADMIN"}
                            onChange={() => handleRoleChange("ADMIN")}
                            className="h-4 w-4 accent-black"
                        />

                        <span className="text-sm text-gray-700">
                            Administrators
                        </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-stone-50">
                        <input
                            type="radio"
                            name="user-role"
                            value="USER"
                            defaultChecked={initialRole === "USER"}
                            onChange={() => handleRoleChange("USER")}
                            className="h-4 w-4 accent-black"
                        />

                        <span className="text-sm text-gray-700">Customers</span>
                    </label>
                </div>
            </div>

            {/* Divider */}

            <div className="border-t border-border" />

            {/* Sort */}

            <div>
                <label
                    htmlFor="user-sort"
                    className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500"
                >
                    Sort By
                </label>

                <select
                    id="user-sort"
                    defaultValue={initialSort}
                    onChange={(event) => handleSortChange(event.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm font-medium text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-stone-100"
                >
                    <option value="newest">Newest first</option>

                    <option value="oldest">Oldest first</option>

                    <option value="name_asc">Name A–Z</option>

                    <option value="name_desc">Name Z–A</option>
                </select>
            </div>
        </div>
    );
};

export default UserFilters;
