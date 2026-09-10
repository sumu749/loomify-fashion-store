import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import EditorialCategoryShowcase from "@/components/home/EditorialCategoryShowcase";
import TestimonialsSlider from "@/components/home/TestimonialsSlider";

import { prisma } from "@/lib/prisma";

const EditorialCampaigns = async () => {
    const [categories, testimonials] = await Promise.all([
        prisma.category.findMany({
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
        }),

        prisma.review.findMany({
            where: {
                approved: true,
                comment: {
                    not: null,
                },
            },
            select: {
                id: true,
                rating: true,
                comment: true,
                user: {
                    select: {
                        name: true,
                    },
                },
                product: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
    ]);

    const mappedCategories = categories.map((category) => ({
        id: category.id,
        slug: category.slug,
        title: category.name,
        image: category.imageUrl ?? "",
        products: category._count.products,
    }));

    const mappedTestimonials = testimonials.filter(
        (
            testimonial,
        ): testimonial is typeof testimonial & {
            comment: string;
        } => testimonial.comment !== null,
    );

    if (mappedCategories.length === 0 && mappedTestimonials.length === 0) {
        return null;
    }

    return (
        <section className="bg-stone-50 py-20 sm:py-24 lg:py-28">
            <Container>
                <SectionTitle
                    subtitle="The Edit"
                    title="Curated for Your Style"
                    description="Explore the latest collections and hear from the people who wear Loomify."
                />

                <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:gap-7">
                    {/* Category Showcase */}
                    <EditorialCategoryShowcase categories={mappedCategories} />

                    {/* Testimonials */}
                    <TestimonialsSlider testimonials={mappedTestimonials} />
                </div>
            </Container>
        </section>
    );
};

export default EditorialCampaigns;
