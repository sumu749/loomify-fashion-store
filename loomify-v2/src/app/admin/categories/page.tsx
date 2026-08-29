import Link from "next/link";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import Button from "@/components/common/Button";

const AdminCategoriesPage = async () => {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },
        orderBy: {
            name: "asc",
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

                    <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                        Categories
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Organize your Loomify product catalog.
                    </p>
                </div>

                <Button asChild>
                    <Link href="/admin/categories/new">
                        <Plus size={18} />
                        Add Category
                    </Link>
                </Button>
            </div>

            {/* Category Table */}
            <div className="mt-8 overflow-hidden rounded-card border border-border bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-175">
                        <thead className="border-b border-border bg-stone-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Category
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Slug
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Products
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="transition hover:bg-stone-50"
                                >
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-primary">
                                            {category.name}
                                        </p>

                                        {category.description && (
                                            <p className="mt-1 max-w-md text-sm text-gray-500">
                                                {category.description}
                                            </p>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {category.slug}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium">
                                        {category._count.products}
                                    </td>

                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/categories/${category.id}`}
                                            className="text-sm font-medium text-accent hover:underline"
                                        >
                                            Manage
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {categories.length === 0 && (
                    <div className="px-6 py-16 text-center">
                        <p className="text-gray-500">No categories found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCategoriesPage;
