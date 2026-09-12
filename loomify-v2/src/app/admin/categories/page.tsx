/* eslint-disable indent */
import Link from "next/link";
import { Plus } from "lucide-react";

import AdminFilterSidebar from "@/components/admin/filters/AdminFilterSidebar";
import CategoryDeleteButton from "@/components/admin/CategoryDeleteButton";
import Button from "@/components/common/Button";
import { prisma } from "@/lib/prisma";
import CategoryFilters from "@/components/admin/categories/CategoryFilters";

interface AdminCategoriesPageProps {
    searchParams: Promise<{
        search?: string;
        sort?: string;
    }>;
}

const AdminCategoriesPage = async ({
    searchParams,
}: AdminCategoriesPageProps) => {
    const params = await searchParams;

    const search = params.search?.trim() ?? "";
    const sort = params.sort ?? "name_asc";

    const categories = await prisma.category.findMany({
        where: search
            ? {
                  OR: [
                      {
                          name: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                      {
                          slug: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                      {
                          description: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                  ],
              }
            : undefined,

        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },

        orderBy:
            sort === "name_desc"
                ? { name: "desc" }
                : sort === "products_high"
                  ? { products: { _count: "desc" } }
                  : sort === "products_low"
                    ? { products: { _count: "asc" } }
                    : { name: "asc" },
    });

    const totalCategories = categories.length;

    const categoriesWithProducts = categories.filter(
        (category) => category._count.products > 0,
    ).length;

    const emptyCategories = categories.filter(
        (category) => category._count.products === 0,
    ).length;

    return (
        <div className="mx-auto max-w-7xl">
            {/* ================= Header ================= */}

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        Catalog
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Categories
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                        Organize and manage the categories in your Loomify
                        catalog.
                    </p>
                </div>

                <Button asChild>
                    <Link href="/admin/categories/new">
                        <Plus size={18} />
                        Add Category
                    </Link>
                </Button>
            </div>

            {/* ================= Overview ================= */}

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Categories
                    </p>

                    <p className="mt-3 text-2xl font-bold text-primary">
                        {totalCategories}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Matching current search
                    </p>
                </div>

                <div className="rounded-2xl border border-green-100 bg-green-50/40 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-600">
                        In Use
                    </p>

                    <p className="mt-3 text-2xl font-bold text-green-800">
                        {categoriesWithProducts}
                    </p>

                    <p className="mt-1 text-xs text-green-700/70">
                        Categories with products
                    </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">
                        Empty
                    </p>

                    <p className="mt-3 text-2xl font-bold text-amber-800">
                        {emptyCategories}
                    </p>

                    <p className="mt-1 text-xs text-amber-700/70">
                        Categories without products
                    </p>
                </div>
            </div>

            {/* ================= Filters + Categories ================= */}

            <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
                {/* Sidebar */}

                <AdminFilterSidebar clearHref="/admin/categories">
                    <CategoryFilters />
                </AdminFilterSidebar>

                {/* Main */}

                <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                Catalog Management
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Product Categories
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500">
                            {totalCategories}{" "}
                            {totalCategories === 1 ? "category" : "categories"}{" "}
                            found
                        </p>
                    </div>

                    {categories.length > 0 ? (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden overflow-x-auto sm:block">
                                <table className="w-full min-w-212.5">
                                    <thead className="border-b border-border bg-stone-50/60">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Category
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Slug
                                            </th>

                                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Products
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Status
                                            </th>

                                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-border">
                                        {categories.map((category) => {
                                            const hasProducts =
                                                category._count.products > 0;

                                            return (
                                                <tr
                                                    key={category.id}
                                                    className="group transition-colors hover:bg-stone-50/70"
                                                >
                                                    {/* Category */}

                                                    <td className="px-6 py-5">
                                                        <Link
                                                            href={`/admin/categories/${category.id}`}
                                                            className="text-sm font-semibold text-primary transition hover:text-accent"
                                                        >
                                                            {category.name}
                                                        </Link>

                                                        {category.description && (
                                                            <p className="mt-1 max-w-md text-sm leading-5 text-gray-500">
                                                                {
                                                                    category.description
                                                                }
                                                            </p>
                                                        )}
                                                    </td>

                                                    {/* Slug */}

                                                    <td className="px-6 py-5">
                                                        <span className="inline-flex rounded-full border border-border bg-stone-50 px-3 py-1 font-mono text-xs text-gray-600">
                                                            {category.slug}
                                                        </span>
                                                    </td>

                                                    {/* Products */}

                                                    <td className="px-6 py-5 text-center">
                                                        <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-stone-100 px-2.5 py-1.5 text-sm font-semibold text-primary">
                                                            {
                                                                category._count
                                                                    .products
                                                            }
                                                        </span>
                                                    </td>

                                                    {/* Status */}

                                                    <td className="px-6 py-5">
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                                                hasProducts
                                                                    ? "border-green-200 bg-green-50 text-green-700"
                                                                    : "border-amber-200 bg-amber-50 text-amber-700"
                                                            }`}
                                                        >
                                                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

                                                            {hasProducts
                                                                ? "In use"
                                                                : "Empty"}
                                                        </span>
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
                                                                    href={`/admin/categories/${category.id}`}
                                                                >
                                                                    Manage
                                                                </Link>
                                                            </Button>

                                                            <CategoryDeleteButton
                                                                categoryId={
                                                                    category.id
                                                                }
                                                                categoryName={
                                                                    category.name
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Categories */}
                            <div className="space-y-3 p-4 sm:hidden">
                                {categories.map((category) => {
                                    const hasProducts =
                                        category._count.products > 0;

                                    return (
                                        <div
                                            key={category.id}
                                            className="rounded-xl border border-border p-4 transition hover:border-accent"
                                        >
                                            {/* Category Header */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/admin/categories/${category.id}`}
                                                        className="text-sm font-semibold text-primary hover:text-accent"
                                                    >
                                                        {category.name}
                                                    </Link>

                                                    {category.description && (
                                                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                                                            {
                                                                category.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <span
                                                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                                                        hasProducts
                                                            ? "border-green-200 bg-green-50 text-green-700"
                                                            : "border-amber-200 bg-amber-50 text-amber-700"
                                                    }`}
                                                >
                                                    {hasProducts
                                                        ? "In use"
                                                        : "Empty"}
                                                </span>
                                            </div>

                                            {/* Category Details */}
                                            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                                                <div>
                                                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                                        Slug
                                                    </p>

                                                    <p className="mt-1 truncate font-mono text-xs text-gray-600">
                                                        {category.slug}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                                        Products
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-primary">
                                                        {
                                                            category._count
                                                                .products
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-4">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/admin/categories/${category.id}`}
                                                    >
                                                        Manage
                                                    </Link>
                                                </Button>

                                                <CategoryDeleteButton
                                                    categoryId={category.id}
                                                    categoryName={category.name}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="px-6 py-20 text-center sm:px-8">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-xl">
                                🗂️
                            </div>

                            <h3 className="mt-5 text-lg font-semibold text-primary">
                                No matching categories
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Try a different search term or clear the filters
                                to view all categories.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AdminCategoriesPage;
