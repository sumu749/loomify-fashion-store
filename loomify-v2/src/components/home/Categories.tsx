import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import CategoryCarousel from "@/components/categories/CategoryCarousel";

import { prisma } from "@/lib/prisma";

const Categories = async () => {
    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
        include: {
            _count: {
                select: {
                    products: {
                        where: {
                            published: true,
                        },
                    },
                },
            },
        },
    });

    const mappedCategories = categories.map((category) => ({
        id: category.id,
        slug: category.slug,
        title: category.name,
        image: category.imageUrl ?? "",
        products: category._count.products,
    }));

    return (
        <section className="py-20 sm:py-24 lg:py-20">
            <Container>
                <SectionTitle
                    subtitle="Top Categories"
                    title="Shop By Category"
                    description="Explore our curated collections and find the pieces that fit your style."
                />

                {mappedCategories.length > 0 ? (
                    <div className="mt-10 sm:mt-14">
                        <CategoryCarousel categories={mappedCategories} />
                    </div>
                ) : (
                    <div className="mt-10 rounded-2xl border border-border bg-stone-50 px-6 py-16 text-center sm:mt-14">
                        <h3 className="text-xl font-semibold text-primary">
                            No categories available
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Categories will appear here once they are added to
                            the store.
                        </p>
                    </div>
                )}
            </Container>
        </section>
    );
};

export default Categories;
