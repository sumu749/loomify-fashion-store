"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

const CategoryFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get("search") ?? "";
    const initialSort = searchParams.get("sort") ?? "name_asc";

    const searchInputRef = useRef<HTMLInputElement>(null);

    const applyFilters = (nextSearch: string, nextSort: string) => {
        const params = new URLSearchParams();

        if (nextSearch.trim()) {
            params.set("search", nextSearch.trim());
        }

        if (nextSort !== "name_asc") {
            params.set("sort", nextSort);
        }

        const query = params.toString();

        router.push(query ? `/admin/categories?${query}` : "/admin/categories");
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        applyFilters(
            searchInputRef.current?.value ?? initialSearch,
            initialSort,
        );
    };

    const handleSortChange = (value: string) => {
        applyFilters(searchInputRef.current?.value ?? initialSearch, value);
    };

    return (
        <div key={`${initialSearch}-${initialSort}`} className="space-y-7">
            {/* Search */}

            <form onSubmit={handleSearchSubmit}>
                <label
                    htmlFor="category-search"
                    className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500"
                >
                    Search
                </label>

                <div className="space-y-3">
                    <input
                        id="category-search"
                        ref={searchInputRef}
                        type="search"
                        defaultValue={initialSearch}
                        placeholder="Search by name or slug..."
                        className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-stone-100"
                    />

                    <button
                        type="submit"
                        className="flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-stone-200"
                    >
                        Apply Search
                    </button>
                </div>
            </form>

            {/* Divider */}

            <div className="border-t border-border" />

            {/* Sort */}

            <div>
                <label
                    htmlFor="category-sort"
                    className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500"
                >
                    Sort By
                </label>

                <select
                    id="category-sort"
                    defaultValue={initialSort}
                    onChange={(event) => handleSortChange(event.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm font-medium text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-stone-100"
                >
                    <option value="name_asc">Name A–Z</option>

                    <option value="name_desc">Name Z–A</option>

                    <option value="products_high">Most products</option>

                    <option value="products_low">Fewest products</option>
                </select>
            </div>
        </div>
    );
};

export default CategoryFilters;
