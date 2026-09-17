/* eslint-disable indent */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import AdminFilterSidebar from "@/components/admin/filters/AdminFilterSidebar";
import Container from "@/components/common/Container";
import ProductFilterSidebar from "@/components/products/ProductFilterSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import ProductPagination from "@/components/products/ProductPagination";
import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton";

import useProductFilters from "@/hooks/useProductFilters";
import useProducts from "@/hooks/useProducts";

export default function ProductsPage() {
    const searchParams = useSearchParams();

    const { data: products = [], isLoading, isError } = useProducts();

    const {
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

        filteredProducts,
    } = useProductFilters(products);

    const pageTitle =
        category !== "all" ? `${category} Collection` : "All Products";

    const pageDescription =
        category !== "all"
            ? `Explore our curated collection of premium ${category.toLowerCase()} fashion essentials.`
            : "Discover our curated collection of premium fashion essentials, designed for everyday style.";

    useEffect(() => {
        const categoryParam = searchParams.get("category");

        if (!categoryParam || categoryParam === "all") {
            setCategory("all");
            return;
        }

        const matchedCategory = categories.find(
            (categoryName) =>
                categoryName.toLowerCase().replace(/\s+/g, "-") ===
                categoryParam.toLowerCase(),
        );

        setCategory(matchedCategory ?? "all");
    }, [searchParams, categories, setCategory]);

    const PRODUCTS_PER_PAGE = 9;

    const [currentPage, setCurrentPage] = useState(1);

    const clearFilters = () => {
        setSearch("");
        setCategory("all");
        setMinPrice("");
        setMaxPrice("");
        setAvailability("all");
        setSort("newest");
        setCurrentPage(1);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [search, category, minPrice, maxPrice, availability, sort]);

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + PRODUCTS_PER_PAGE,
    );
    if (isLoading) {
        return (
            <section className="py-20">
                <Container>
                    <ProductGridSkeleton />
                </Container>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="py-20">
                <Container>
                    <div className="py-20 text-center">
                        <h2 className="text-2xl font-semibold text-primary">
                            Failed to load products
                        </h2>

                        <p className="mt-3 text-gray-500">
                            Please try again later.
                        </p>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="py-16 sm:py-24">
            <Container>
                {/* ================= Header ================= */}

                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        Loomify Collection
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
                        {pageTitle}
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                        {pageDescription}
                    </p>
                </div>

                {/* ================= Mobile Filters ================= */}

                <div className="mb-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] lg:hidden">
                    <AdminFilterSidebar title="Shop Filters">
                        <ProductFilterSidebar
                            search={search}
                            setSearch={setSearch}
                            category={category}
                            setCategory={setCategory}
                            categories={categories}
                            minPrice={minPrice}
                            setMinPrice={setMinPrice}
                            maxPrice={maxPrice}
                            setMaxPrice={setMaxPrice}
                            availability={availability}
                            setAvailability={setAvailability}
                            sort={sort}
                            setSort={setSort}
                            onClear={clearFilters}
                        />
                    </AdminFilterSidebar>

                    <div className="flex min-h-12 items-center rounded-2xl border border-border bg-stone-50 px-4 py-3 text-sm text-gray-500 sm:justify-center">
                        {filteredProducts.length}{" "}
                        {filteredProducts.length === 1 ? "product" : "products"}
                    </div>
                </div>

                {/* ================= Desktop + Mobile Content ================= */}

                <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] xl:gap-10">
                    {/* ================= Desktop Sidebar ================= */}

                    <aside className="hidden h-fit rounded-2xl border border-border bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:block">
                        <div className="mb-6 border-b border-border pb-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                Refine
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Shop Filters
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                Narrow down the collection to find what you
                                need.
                            </p>
                        </div>

                        <ProductFilterSidebar
                            search={search}
                            setSearch={setSearch}
                            category={category}
                            setCategory={setCategory}
                            categories={categories}
                            minPrice={minPrice}
                            setMinPrice={setMinPrice}
                            maxPrice={maxPrice}
                            setMaxPrice={setMaxPrice}
                            availability={availability}
                            setAvailability={setAvailability}
                            sort={sort}
                            setSort={setSort}
                            onClear={clearFilters}
                        />
                    </aside>

                    {/* ================= Products ================= */}

                    <div className="min-w-0">
                        {/* Results Header */}

                        <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-primary">
                                    {filteredProducts.length === 0
                                        ? "No products found"
                                        : `Showing ${startIndex + 1}-${Math.min(
                                              startIndex + PRODUCTS_PER_PAGE,
                                              filteredProducts.length,
                                          )} of ${filteredProducts.length} products`}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Showing matching items from the collection
                                </p>
                            </div>

                            {(search ||
                                category !== "all" ||
                                sort !== "newest") && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="self-start text-xs font-medium text-gray-500 transition hover:text-accent sm:self-auto"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>

                        <ProductGrid products={paginatedProducts} />
                        <ProductPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}
