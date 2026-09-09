import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";

import { prisma } from "@/lib/prisma";

const EditorialCampaigns = async () => {
    const categories = await prisma.category.findMany({
        where: {
            slug: {
                in: ["women", "men"],
            },
        },
        orderBy: {
            name: "asc",
        },
        take: 2,
    });

    if (categories.length === 0) {
        return null;
    }

    return (
        <section className="py-20 sm:py-24 lg:py-28">
            <Container>
                <SectionTitle
                    subtitle="The Edit"
                    title="Curated for Your Style"
                    description="Explore carefully selected collections designed to bring effortless character to every look."
                />

                <div className="grid gap-5 md:grid-cols-2 lg:gap-7">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/products?category=${encodeURIComponent(
                                category.slug,
                            )}`}
                            className="group block"
                        >
                            <article className="relative min-h-107.5 overflow-hidden rounded-[1.75rem] bg-stone-100 sm:min-h-125 lg:min-h-140">
                                {category.imageUrl ? (
                                    <Image
                                        src={category.imageUrl}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-sm text-gray-400">
                                        No image available
                                    </div>
                                )}

                                {/* Editorial overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent transition-all duration-500 group-hover:from-black/80" />

                                {/* Small label */}
                                <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
                                    <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/70 sm:text-xs">
                                        Loomify Edit
                                    </p>
                                </div>

                                {/* Content */}
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
                </div>
            </Container>
        </section>
    );
};

export default EditorialCampaigns;
