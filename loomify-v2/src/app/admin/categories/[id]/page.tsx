import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import CategoryEditForm from "@/components/admin/CategoryEditForm";

interface CategoryEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

const CategoryEditPage = async ({ params }: CategoryEditPageProps) => {
    const { id } = await params;

    const category = await prisma.category.findUnique({
        where: {
            id,
        },
    });

    if (!category) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Catalog
                </p>

                <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                    Edit Category
                </h1>

                <p className="mt-2 text-gray-600">
                    Update category information.
                </p>
            </div>

            <CategoryEditForm category={category} />
        </div>
    );
};

export default CategoryEditPage;
