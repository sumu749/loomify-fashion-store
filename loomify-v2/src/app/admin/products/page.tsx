import Link from "next/link";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import Button from "@/components/common/Button";
import formatCurrency from "@/utils/formatCurrency";

const AdminProductsPage = async () => {
    const products = await prisma.product.findMany({
        include: {
            category: true,
            variants: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        Catalog
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-primary">
                        Products
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage your Loomify product catalog.
                    </p>
                </div>

                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus size={18} />
                        Add Product
                    </Link>
                </Button>
            </div>

            {/* Products Table */}
            <div className="mt-8 overflow-hidden rounded-card border border-border bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="border-b border-border bg-stone-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Product
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Category
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Price
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Stock
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
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

                                return (
                                    <tr
                                        key={product.id}
                                        className="transition hover:bg-stone-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-primary">
                                                    {product.name}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {product.sku}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {product.category.name}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium">
                                            {formatCurrency(
                                                Number(product.price),
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            {totalVariantStock}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    product.published
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {product.published
                                                    ? "Published"
                                                    : "Draft"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="text-sm font-medium text-accent hover:underline"
                                            >
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {products.length === 0 && (
                    <div className="px-6 py-16 text-center">
                        <p className="text-gray-500">No products found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProductsPage;
