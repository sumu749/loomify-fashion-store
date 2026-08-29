import CategoryForm from "@/components/admin/CategoryForm";

const NewCategoryPage = () => {
    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Catalog
                </p>

                <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                    Add Category
                </h1>

                <p className="mt-2 text-gray-600">
                    Create a new product category for Loomify.
                </p>
            </div>

            <CategoryForm />
        </div>
    );
};

export default NewCategoryPage;
