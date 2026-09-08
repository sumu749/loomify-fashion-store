"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import Container from "@/components/common/Container";
import ProductFilterSidebar from "@/components/products/ProductFilterSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton";

import useProductFilters from "@/hooks/useProductFilters";
import useProducts from "@/hooks/useProducts";

export default function ProductsPage() {
    const { data: products = [], isLoading, isError } = useProducts();

    const {
        search,
        setSearch,

        category,
        setCategory,

        categories,

        sort,
        setSort,

        filteredProducts,
    } = useProductFilters(products);

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const clearFilters = () => {
        setSearch("");
        setCategory("all");
        setSort("newest");
    };

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
                        All Products
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                        Discover our curated collection of premium fashion
                        essentials, designed for everyday style.
                    </p>
                </div>

                {/* ================= Mobile Search ================= */}

                <div className="mb-6 lg:hidden">
                    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                        <ProductFilterSidebar
                            search={search}
                            setSearch={setSearch}
                            category={category}
                            setCategory={setCategory}
                            categories={categories}
                            sort={sort}
                            setSort={setSort}
                            onClear={clearFilters}
                        />
                    </div>
                </div>

                {/* ================= Mobile Filter Button ================= */}

                <div className="mb-8 flex gap-3 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setIsFilterOpen(true)}
                        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-medium text-primary shadow-sm transition hover:border-accent hover:text-accent"
                    >
                        <SlidersHorizontal size={17} />
                        Filters
                    </button>

                    <div className="flex h-11 items-center rounded-xl border border-border bg-stone-50 px-4 text-sm text-gray-500">
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
                                    {filteredProducts.length}{" "}
                                    {filteredProducts.length === 1
                                        ? "product"
                                        : "products"}
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

                        <ProductGrid products={filteredProducts} />
                    </div>
                </div>

                {/* ================= Mobile Filter Drawer ================= */}

                {isFilterOpen && (
                    <div className="fixed inset-0 z-60 lg:hidden">
                        {/* Backdrop */}

                        <button
                            type="button"
                            aria-label="Close filters"
                            onClick={() => setIsFilterOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                        />

                        {/* Drawer */}

                        <aside className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white px-5 pb-8 pt-5 shadow-2xl sm:left-auto sm:w-95 sm:rounded-none sm:rounded-l-3xl sm:pb-8 sm:pt-6">
                            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                        Refine
                                    </p>

                                    <h2 className="mt-1 text-xl font-semibold text-primary">
                                        Shop Filters
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsFilterOpen(false)}
                                    className="rounded-full p-2 transition hover:bg-stone-100"
                                    aria-label="Close filters"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <ProductFilterSidebar
                                search={search}
                                setSearch={setSearch}
                                category={category}
                                setCategory={setCategory}
                                categories={categories}
                                sort={sort}
                                setSort={setSort}
                                onClear={clearFilters}
                            />

                            <button
                                type="button"
                                onClick={() => setIsFilterOpen(false)}
                                className="mt-7 h-12 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-accent"
                            >
                                View {filteredProducts.length}{" "}
                                {filteredProducts.length === 1
                                    ? "Product"
                                    : "Products"}
                            </button>
                        </aside>
                    </div>
                )}
            </Container>
        </section>
    );
}
