"use client";

import ProductFilters from "@/components/products/ProductFilters";
import ProductSearch from "@/components/products/ProductSearch";
import ProductSort from "@/components/products/ProductSort";

import type {
    ProductAvailability,
    ProductSort as ProductSortType,
} from "@/hooks/useProductFilters";

interface ProductFilterSidebarProps {
    search: string;
    setSearch: (value: string) => void;

    category: string;
    setCategory: (value: string) => void;

    categories: string[];

    minPrice: string;
    setMinPrice: (value: string) => void;

    maxPrice: string;
    setMaxPrice: (value: string) => void;

    availability: ProductAvailability;
    setAvailability: (value: ProductAvailability) => void;

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

    minPrice,
    setMinPrice,

    maxPrice,
    setMaxPrice,

    availability,
    setAvailability,

    sort,
    setSort,

    onClear,
}: ProductFilterSidebarProps) => {
    const hasActiveFilters =
        Boolean(search.trim()) ||
        category !== "all" ||
        Boolean(minPrice.trim()) ||
        Boolean(maxPrice.trim()) ||
        availability !== "all" ||
        sort !== "newest";

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

            {/* Price */}

            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Price Range
                </p>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label
                            htmlFor="product-min-price"
                            className="mb-1.5 block text-[11px] text-gray-400"
                        >
                            Min
                        </label>

                        <input
                            id="product-min-price"
                            type="number"
                            min="0"
                            step="1"
                            value={minPrice}
                            onChange={(event) =>
                                setMinPrice(event.target.value)
                            }
                            placeholder="0"
                            className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-accent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="product-max-price"
                            className="mb-1.5 block text-[11px] text-gray-400"
                        >
                            Max
                        </label>

                        <input
                            id="product-max-price"
                            type="number"
                            min="0"
                            step="1"
                            value={maxPrice}
                            onChange={(event) =>
                                setMaxPrice(event.target.value)
                            }
                            placeholder="Any"
                            className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-accent"
                        />
                    </div>
                </div>

                <p className="mt-2 text-[11px] leading-4 text-gray-400">
                    Enter a minimum and maximum price.
                </p>
            </div>

            {/* Availability */}

            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Availability
                </p>

                <div className="space-y-2">
                    {[
                        ["all", "All products"],
                        ["in-stock", "In stock"],
                        ["out-of-stock", "Out of stock"],
                    ].map(([value, label]) => {
                        const isSelected = availability === value;

                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() =>
                                    setAvailability(
                                        value as ProductAvailability,
                                    )
                                }
                                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-stone-50"
                            >
                                {/* Custom radio */}

                                <span
                                    className={`relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                                        isSelected
                                            ? "border-primary"
                                            : "border-gray-300 bg-white"
                                    }`}
                                >
                                    {isSelected && (
                                        <span className="h-2 w-2 rounded-full bg-primary" />
                                    )}
                                </span>

                                <span
                                    className={`text-sm ${
                                        isSelected
                                            ? "font-medium text-primary"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sort */}

            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Sort By
                </p>

                <ProductSort value={sort} onChange={setSort} />
            </div>

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
