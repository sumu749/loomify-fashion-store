/* eslint-disable indent */
import Link from "next/link";
import { Plus } from "lucide-react";

import AdminFilterSidebar from "@/components/admin/filters/AdminFilterSidebar";
import ProductFilters from "@/components/admin/products/ProductFilters";
import ProductStatusToggle from "@/components/admin/ProductStatusToggle";
import ProductDeleteButton from "@/components/admin/ProductDeleteButton";
import Button from "@/components/common/Button";
import { prisma } from "@/lib/prisma";
import formatCurrency from "@/utils/formatCurrency";

interface AdminProductsPageProps {
    searchParams: Promise<{
        search?: string;
        category?: string;
        published?: string;
        stock?: string;
        sort?: string;
    }>;
}

const AdminProductsPage = async ({ searchParams }: AdminProductsPageProps) => {
    const params = await searchParams;

    const search = params.search?.trim() ?? "";
    const category = params.category ?? "ALL";
    const published = params.published ?? "ALL";
    const stock = params.stock ?? "ALL";
    const sort = params.sort ?? "newest";

    /*
     * Fetch categories for the filter sidebar.
     */
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    /*
     * Build product filters.
     *
     * Product stock is derived from ProductVariant.stock.
     */
    const stockFilter =
        stock === "IN_STOCK"
            ? {
                  variants: {
                      some: {
                          stock: {
                              gt: 0,
                          },
                      },
                  },
              }
            : stock === "LOW_STOCK"
              ? {
                    variants: {
                        some: {
                            stock: {
                                gt: 0,
                                lte: 5,
                            },
                        },
                    },
                }
              : stock === "OUT_OF_STOCK"
                ? {
                      variants: {
                          every: {
                              stock: {
                                  lte: 0,
                              },
                          },
                      },
                  }
                : {};

    const where = {
        ...(category !== "ALL" && {
            category: {
                slug: category,
            },
        }),

        ...(published === "true" && {
            published: true,
        }),

        ...(published === "false" && {
            published: false,
        }),

        ...(search && {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive" as const,
                    },
                },
                {
                    sku: {
                        contains: search,
                        mode: "insensitive" as const,
                    },
                },
            ],
        }),

        ...stockFilter,
    };

    /*
     * Sorting
     */
    const orderBy =
        sort === "oldest"
            ? { createdAt: "asc" as const }
            : sort === "name_asc"
              ? { name: "asc" as const }
              : sort === "name_desc"
                ? { name: "desc" as const }
                : sort === "highest"
                  ? { price: "desc" as const }
                  : sort === "lowest"
                    ? { price: "asc" as const }
                    : { createdAt: "desc" as const };

    const products = await prisma.product.findMany({
        where,
        include: {
            category: true,
            variants: true,
        },
        orderBy,
    });

    /*
     * These counts represent the currently filtered result set.
     */
    const totalProducts = products.length;

    const publishedProducts = products.filter(
        (product) => product.published,
    ).length;

    const draftProducts = products.filter(
        (product) => !product.published,
    ).length;

    const totalStock = products.reduce(
        (productTotal, product) =>
            productTotal +
            product.variants.reduce(
                (variantTotal, variant) => variantTotal + variant.stock,
                0,
            ),
        0,
    );

    return (
        <div className="mx-auto max-w-7xl">
            {/* ================= Header ================= */}

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        Catalog
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Products
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                        Manage your Loomify product catalog, inventory, and
                        visibility.
                    </p>
                </div>

                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus size={18} />
                        Add Product
                    </Link>
                </Button>
            </div>

            {/* ================= Overview ================= */}

            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Products
                    </p>

                    <p className="mt-3 text-2xl font-bold text-primary">
                        {totalProducts}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Matching current filters
                    </p>
                </div>

                <div className="rounded-2xl border border-green-100 bg-green-50/40 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-600">
                        Published
                    </p>

                    <p className="mt-3 text-2xl font-bold text-green-800">
                        {publishedProducts}
                    </p>

                    <p className="mt-1 text-xs text-green-700/70">
                        Visible in storefront
                    </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">
                        Drafts
                    </p>

                    <p className="mt-3 text-2xl font-bold text-amber-800">
                        {draftProducts}
                    </p>

                    <p className="mt-1 text-xs text-amber-700/70">
                        Hidden from storefront
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Total Stock
                    </p>

                    <p className="mt-3 text-2xl font-bold text-primary">
                        {totalStock}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Across all matching variants
                    </p>
                </div>
            </div>

            {/* ================= Filters + Products ================= */}

            <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
                {/* Filter Sidebar */}

                <AdminFilterSidebar>
                    <ProductFilters categories={categories} />
                </AdminFilterSidebar>

                {/* Products */}

                <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                    {/* Section Header */}

                    <div className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                Catalog Management
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Product Inventory
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500">
                            {totalProducts}{" "}
                            {totalProducts === 1 ? "product" : "products"} found
                        </p>
                    </div>

                    {products.length > 0 ? (
                        <>
                            <div className="hidden overflow-x-auto sm:block">
                                <table className="w-full min-w-250">
                                    <thead className="border-b border-border bg-stone-50/80">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Product
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Category
                                            </th>

                                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Price
                                            </th>

                                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Stock
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
                                        {products.map((product) => {
                                            const totalVariantStock =
                                                product.variants.reduce(
                                                    (total, variant) =>
                                                        total + variant.stock,
                                                    0,
                                                );

                                            const isOutOfStock =
                                                totalVariantStock === 0;

                                            const isLowStock =
                                                totalVariantStock > 0 &&
                                                totalVariantStock <= 5;

                                            return (
                                                <tr
                                                    key={product.id}
                                                    className="group transition hover:bg-stone-50/60"
                                                >
                                                    {/* Product */}

                                                    <td className="px-6 py-5">
                                                        <div className="min-w-0">
                                                            <Link
                                                                href={`/admin/products/${product.id}`}
                                                                className="font-semibold text-primary transition hover:text-accent"
                                                            >
                                                                {product.name}
                                                            </Link>

                                                            <p className="mt-1 text-xs text-gray-400">
                                                                {product.sku}
                                                            </p>
                                                        </div>
                                                    </td>

                                                    {/* Category */}

                                                    <td className="px-6 py-5">
                                                        <span className="inline-flex rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                                                            {
                                                                product.category
                                                                    .name
                                                            }
                                                        </span>
                                                    </td>

                                                    {/* Price */}

                                                    <td className="px-6 py-5 text-right">
                                                        <p className="text-sm font-semibold text-primary">
                                                            {formatCurrency(
                                                                Number(
                                                                    product.price,
                                                                ),
                                                            )}
                                                        </p>
                                                    </td>

                                                    {/* Stock */}

                                                    <td className="px-6 py-5 text-center">
                                                        <div className="flex flex-col items-center gap-1.5">
                                                            <span
                                                                className={`inline-flex min-w-10 items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-semibold ${
                                                                    isOutOfStock
                                                                        ? "bg-red-50 text-red-700"
                                                                        : isLowStock
                                                                          ? "bg-amber-50 text-amber-700"
                                                                          : "bg-green-50 text-green-700"
                                                                }`}
                                                            >
                                                                {
                                                                    totalVariantStock
                                                                }
                                                            </span>

                                                            <span className="text-[11px] text-gray-400">
                                                                {isOutOfStock
                                                                    ? "Out of stock"
                                                                    : isLowStock
                                                                      ? "Low stock"
                                                                      : "In stock"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Status */}

                                                    <td className="px-6 py-5">
                                                        <ProductStatusToggle
                                                            productId={
                                                                product.id
                                                            }
                                                            published={
                                                                product.published
                                                            }
                                                        />
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
                                                                    href={`/admin/products/${product.id}`}
                                                                >
                                                                    Manage
                                                                </Link>
                                                            </Button>

                                                            <ProductDeleteButton
                                                                productId={
                                                                    product.id
                                                                }
                                                                productName={
                                                                    product.name
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

                            {/* Mobile Products */}
                            <div className="space-y-3 p-4 sm:hidden">
                                {products.map((product) => {
                                    const totalVariantStock =
                                        product.variants.reduce(
                                            (total, variant) =>
                                                total + variant.stock,
                                            0,
                                        );

                                    const isOutOfStock =
                                        totalVariantStock === 0;

                                    const isLowStock =
                                        totalVariantStock > 0 &&
                                        totalVariantStock <= 5;

                                    return (
                                        <div
                                            key={product.id}
                                            className="rounded-xl border border-border p-4 transition hover:border-accent"
                                        >
                                            {/* Product Info */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                        className="line-clamp-2 text-sm font-semibold text-primary hover:text-accent"
                                                    >
                                                        {product.name}
                                                    </Link>

                                                    <p className="mt-1 truncate text-xs text-gray-400">
                                                        {product.sku}
                                                    </p>
                                                </div>

                                                <span className="shrink-0 rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                                    {product.category.name}
                                                </span>
                                            </div>

                                            {/* Product Details */}
                                            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                                                <div>
                                                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                                        Price
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-primary">
                                                        {formatCurrency(
                                                            Number(
                                                                product.price,
                                                            ),
                                                        )}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                                        Stock
                                                    </p>

                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span
                                                            className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                                                isOutOfStock
                                                                    ? "bg-red-50 text-red-700"
                                                                    : isLowStock
                                                                      ? "bg-amber-50 text-amber-700"
                                                                      : "bg-green-50 text-green-700"
                                                            }`}
                                                        >
                                                            {totalVariantStock}
                                                        </span>

                                                        <span className="text-[11px] text-gray-400">
                                                            {isOutOfStock
                                                                ? "Out"
                                                                : isLowStock
                                                                  ? "Low"
                                                                  : "In"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status + Actions */}
                                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                                                <ProductStatusToggle
                                                    productId={product.id}
                                                    published={
                                                        product.published
                                                    }
                                                />

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Link
                                                            href={`/admin/products/${product.id}`}
                                                        >
                                                            Manage
                                                        </Link>
                                                    </Button>

                                                    <ProductDeleteButton
                                                        productId={product.id}
                                                        productName={
                                                            product.name
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="px-6 py-20 text-center sm:px-8">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-xl">
                                🛍
                            </div>

                            <h3 className="mt-5 text-lg font-semibold text-primary">
                                No matching products
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Try adjusting your search or filter options to
                                find the products you are looking for.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AdminProductsPage;
