import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import CategoryCard from "@/components/categories/CategoryCard";

import { prisma } from "@/lib/prisma";

const categoryPriority = ["Women", "Men", "Footwear", "Accessories"];

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

    const sortedCategories = [...categories].sort((a, b) => {
        const aIndex = categoryPriority.indexOf(a.name);
        const bIndex = categoryPriority.indexOf(b.name);

        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
        }

        if (aIndex !== -1) {
            return -1;
        }

        if (bIndex !== -1) {
            return 1;
        }

        return a.name.localeCompare(b.name);
    });

    return (
        <section className="py-20 sm:py-24 lg:py-28">
            <Container>
                <SectionTitle
                    subtitle="Collections"
                    title="Shop by Category"
                    description="Explore our curated collections tailored to every lifestyle."
                />

                {sortedCategories.length > 0 ? (
                    <div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-2 lg:gap-6">
                        {sortedCategories.map((category, index) => (
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
                                featured={index < 2}
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
