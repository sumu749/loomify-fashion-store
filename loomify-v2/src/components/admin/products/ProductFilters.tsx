"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type StockFilter = "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface ProductFiltersProps {
    categories: Category[];
}

const ProductFilters = ({ categories }: ProductFiltersProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
    const category = searchParams.get("category") ?? "ALL";
    const published = searchParams.get("published") ?? "ALL";
    const stock = (searchParams.get("stock") as StockFilter) || "ALL";
    const sort = searchParams.get("sort") ?? "newest";

    const updateFilters = (
        nextSearch: string,
        nextCategory: string,
        nextPublished: string,
        nextStock: StockFilter,
        nextSort: string,
    ) => {
        const params = new URLSearchParams();

        if (nextSearch.trim()) {
            params.set("search", nextSearch.trim());
        }

        if (nextCategory !== "ALL") {
            params.set("category", nextCategory);
        }

        if (nextPublished !== "ALL") {
            params.set("published", nextPublished);
        }

        if (nextStock !== "ALL") {
            params.set("stock", nextStock);
        }

        if (nextSort !== "newest") {
            params.set("sort", nextSort);
        }

        const query = params.toString();

        router.push(query ? `/admin/products?${query}` : "/admin/products");
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        updateFilters(search, category, published, stock, sort);
    };

    const handleCategoryChange = (value: string) => {
        updateFilters(search, value, published, stock, sort);
    };

    const handlePublishedChange = (value: string) => {
        updateFilters(search, category, value, stock, sort);
    };

    const handleStockChange = (value: StockFilter) => {
        updateFilters(search, category, published, value, sort);
    };

    const handleSortChange = (value: string) => {
        updateFilters(search, category, published, stock, value);
    };

    const clearFilters = () => {
        setSearch("");

        router.push("/admin/products");
    };

    const hasActiveFilters =
        Boolean(search.trim()) ||
        category !== "ALL" ||
        published !== "ALL" ||
        stock !== "ALL" ||
        sort !== "newest";

    return (
        <div className="space-y-6">
            {/* Search */}

            <form onSubmit={handleSearchSubmit}>
                <label
                    htmlFor="product-search"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                    Search
                </label>

                <div className="relative">
                    <input
                        id="product-search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Name or SKU..."
                        className="h-11 w-full rounded-xl border border-border bg-white px-4 pr-10 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-accent"
                    />

                    <button
                        type="submit"
                        aria-label="Search products"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-primary"
                    >
                        ↵
                    </button>
                </div>
            </form>

            {/* Category */}

            <div>
                <label
                    htmlFor="product-category"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                    Category
                </label>

                <select
                    id="product-category"
                    value={category}
                    onChange={(event) =>
                        handleCategoryChange(event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-primary outline-none transition focus:border-accent"
                >
                    <option value="ALL">All categories</option>

                    {categories.map((item) => (
                        <option key={item.id} value={item.slug}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Visibility */}

            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Visibility
                </p>

                <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-stone-50">
                        <input
                            type="radio"
                            name="product-published"
                            checked={published === "ALL"}
                            onChange={() => handlePublishedChange("ALL")}
                            className="h-4 w-4 accent-black"
                        />

                        <span className="text-sm text-gray-700">
                            All products
                        </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-stone-50">
                        <input
                            type="radio"
                            name="product-published"
                            checked={published === "true"}
                            onChange={() => handlePublishedChange("true")}
                            className="h-4 w-4 accent-black"
                        />

                        <span className="text-sm text-gray-700">Published</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-stone-50">
                        <input
                            type="radio"
                            name="product-published"
                            checked={published === "false"}
                            onChange={() => handlePublishedChange("false")}
                            className="h-4 w-4 accent-black"
                        />

                        <span className="text-sm text-gray-700">Draft</span>
                    </label>
                </div>
            </div>

            {/* Stock */}

            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Stock
                </p>

                <div className="space-y-2">
                    {[
                        ["ALL", "All stock"],
                        ["IN_STOCK", "In stock"],
                        ["LOW_STOCK", "Low stock"],
                        ["OUT_OF_STOCK", "Out of stock"],
                    ].map(([value, label]) => (
                        <label
                            key={value}
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-stone-50"
                        >
                            <input
                                type="radio"
                                name="product-stock"
                                value={value}
                                checked={stock === value}
                                onChange={() =>
                                    handleStockChange(value as StockFilter)
                                }
                                className="h-4 w-4 accent-black"
                            />

                            <span className="text-sm text-gray-700">
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Sort */}

            <div>
                <label
                    htmlFor="product-sort"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                    Sort By
                </label>

                <select
                    id="product-sort"
                    value={sort}
                    onChange={(event) => handleSortChange(event.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-primary outline-none transition focus:border-accent"
                >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="name_asc">Name A–Z</option>
                    <option value="name_desc">Name Z–A</option>
                    <option value="highest">Highest price</option>
                    <option value="lowest">Lowest price</option>
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

export default ProductFilters;
