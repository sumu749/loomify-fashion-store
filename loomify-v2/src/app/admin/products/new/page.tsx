import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

const NewProductPage = async () => {
    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
        },
    });

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Catalog
                </p>

                <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                    Add Product
                </h1>

                <p className="mt-2 text-gray-600">
                    Create a new product for your store.
                </p>
            </div>

            <ProductForm categories={categories} />
        </div>
    );
};

export default NewProductPage;
