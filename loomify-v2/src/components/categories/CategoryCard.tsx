import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Category } from "@/types/category";

interface CategoryCardProps {
    category: Category;
    featured?: boolean;
}

const CategoryCard = ({ category, featured = false }: CategoryCardProps) => {
    const { title, slug, image, products } = category;

    return (
        <Link
            href={`/products?category=${encodeURIComponent(slug)}`}
            className="group block"
        >
            <article
                className={`relative overflow-hidden rounded-[1.75rem] bg-stone-100 ${
                    featured
                        ? "min-h-105 sm:min-h-125 lg:min-h-140"
                        : "min-h-75 sm:min-h-90 lg:min-h-80"
                }`}
            >
                {/* Image */}
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes={
                            featured
                                ? "(max-width: 1024px) 100vw, 50vw"
                                : "(max-width: 1024px) 100vw, 50vw"
                        }
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-sm text-gray-400">
                        No image available
                    </div>
                )}

                {/* Editorial overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-black/0 transition-all duration-500 group-hover:from-black/75" />

                {/* Top label */}
                <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
                    <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/75 sm:text-xs">
                        Collection
                    </span>
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
                    <div className="flex items-end justify-between gap-5">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-white/65">
                                {products}{" "}
                                {products === 1 ? "Product" : "Products"}
                            </p>

                            <h3
                                className={`mt-2 font-semibold tracking-tight text-white ${
                                    featured
                                        ? "text-3xl sm:text-4xl lg:text-5xl"
                                        : "text-2xl sm:text-3xl"
                                }`}
                            >
                                {title}
                            </h3>

                            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/85">
                                <span className="border-b border-white/40 pb-1 transition-colors duration-300 group-hover:border-white">
                                    Explore collection
                                </span>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-primary sm:h-12 sm:w-12">
                            <ArrowUpRight size={19} />
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default CategoryCard;
