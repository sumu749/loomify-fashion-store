import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import CategoryCard from "@/components/categories/CategoryCard";

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

    return (
        <section className="py-20">
            <Container>
                <SectionTitle
                    subtitle="Collections"
                    title="Shop by Category"
                    description="Explore our curated collections tailored to every lifestyle."
                />

                {categories.length > 0 ? (
                    <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={{
                                    id: category.id,
                                    slug: category.slug,
                                    title: category.name,
                                    image:
                                        category.imageUrl ??
                                        "/images/placeholder-product.jpg",
                                    products: category._count.products,
                                }}
                            />
                        ))}
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
