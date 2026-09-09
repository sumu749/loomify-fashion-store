import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import TestimonialsSlider from "@/components/home/TestimonialsSlider";

import { prisma } from "@/lib/prisma";

const EditorialCampaigns = async () => {
    const [categories, testimonials] = await Promise.all([
        prisma.category.findMany({
            where: {
                slug: {
                    in: ["women", "men"],
                },
            },
            orderBy: {
                name: "asc",
            },
            take: 2,
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

    if (categories.length === 0 && testimonials.length === 0) {
        return null;
    }

    return (
        <section className="bg-stone-50 py-20 sm:py-24 lg:py-28">
            <Container>
                <SectionTitle
                    subtitle="The Edit"
                    title="Curated for Your Style"
                    description="Discover considered collections and real stories from the Loomify community."
                />

                <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
                    {/* ================= Women ================= */}

                    {categories
                        .filter((category) => category.slug === "women")
                        .map((category) => (
                            <Link
                                key={category.id}
                                href={`/products?category=${encodeURIComponent(
                                    category.slug,
                                )}`}
                                className="group block"
                            >
                                <article className="relative min-h-107.5 overflow-hidden  bg-stone-100 sm:min-h-125 lg:min-h-140">
                                    {category.imageUrl ? (
                                        <Image
                                            src={category.imageUrl}
                                            alt={category.name}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-sm text-gray-400">
                                            No image available
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent transition-all duration-500 group-hover:from-black/80" />

                                    <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
                                        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/70 sm:text-xs">
                                            Loomify Edit
                                        </p>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                                        <div className="flex items-end justify-between gap-6">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/65">
                                                    Discover the collection
                                                </p>

                                                <h3 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                                                    {category.name}
                                                </h3>

                                                <span className="mt-5 inline-flex items-center border-b border-white/60 pb-1 text-sm font-medium text-white transition-colors duration-300 group-hover:border-white">
                                                    Shop Collection
                                                </span>
                                            </div>

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-primary sm:h-14 sm:w-14">
                                                <ArrowUpRight size={21} />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}

                    {/* ================= Men ================= */}

                    {categories
                        .filter((category) => category.slug === "men")
                        .map((category) => (
                            <Link
                                key={category.id}
                                href={`/products?category=${encodeURIComponent(
                                    category.slug,
                                )}`}
                                className="group block"
                            >
                                <article className="relative min-h-107.5 overflow-hidden  bg-stone-100 sm:min-h-125 lg:min-h-140">
                                    {category.imageUrl ? (
                                        <Image
                                            src={category.imageUrl}
                                            alt={category.name}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-sm text-gray-400">
                                            No image available
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent transition-all duration-500 group-hover:from-black/80" />

                                    <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
                                        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/70 sm:text-xs">
                                            Loomify Edit
                                        </p>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                                        <div className="flex items-end justify-between gap-6">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/65">
                                                    Discover the collection
                                                </p>

                                                <h3 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                                                    {category.name}
                                                </h3>

                                                <span className="mt-5 inline-flex items-center border-b border-white/60 pb-1 text-sm font-medium text-white transition-colors duration-300 group-hover:border-white">
                                                    Shop Collection
                                                </span>
                                            </div>

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-primary sm:h-14 sm:w-14">
                                                <ArrowUpRight size={21} />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}

                    {/* ================= Testimonials ================= */}

                    <TestimonialsSlider
                        testimonials={testimonials.filter(
                            (
                                testimonial,
                            ): testimonial is typeof testimonial & {
                                comment: string;
                            } => testimonial.comment !== null,
                        )}
                    />
                </div>
            </Container>
        </section>
    );
};

export default EditorialCampaigns;
