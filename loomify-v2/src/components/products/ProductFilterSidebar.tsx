"use client";

import ProductFilters from "@/components/products/ProductFilters";
import ProductSearch from "@/components/products/ProductSearch";
import ProductSort from "@/components/products/ProductSort";

import type { ProductSort as ProductSortType } from "@/hooks/useProductFilters";

interface ProductFilterSidebarProps {
    search: string;
    setSearch: (value: string) => void;

    category: string;
    setCategory: (value: string) => void;

    categories: string[];

    sort: ProductSortType;
    setSort: (value: ProductSortType) => void;

    onClear: () => void;
}

const ProductFilterSidebar = ({
    search,
    setSearch,
    category,
    setCategory,
    categories,
    sort,
    setSort,
    onClear,
}: ProductFilterSidebarProps) => {
    const hasActiveFilters =
        Boolean(search.trim()) || category !== "all" || sort !== "newest";

    return (
        <div className="space-y-7">
            {/* Search */}

            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Search
                </p>

                <ProductSearch value={search} onChange={setSearch} />
            </div>

            {/* Category */}

            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Category
                </p>

                <ProductFilters
                    categories={categories}
                    value={category}
                    onChange={setCategory}
                />
            </div>

            {/* Sort */}

            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Sort By
                </p>

                <ProductSort value={sort} onChange={setSort} />
            </div>

            {/* Active Filter Summary */}

            {hasActiveFilters && (
                <div className="rounded-xl bg-stone-50 px-4 py-3">
                    <p className="text-xs leading-5 text-gray-500">
                        Filters are currently applied to this collection.
                    </p>
                </div>
            )}

            {/* Clear */}

            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-primary hover:bg-stone-50 hover:text-primary"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );
};

export default ProductFilterSidebar;
