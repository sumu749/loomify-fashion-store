import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Category } from "@/types/category";

interface CategoryCardProps {
    category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
    const { title, image, products } = category;

    return (
        <Link
            href={`/products?category=${encodeURIComponent(title.toLowerCase())}`}
            className="group block"
        >
            <article className="overflow-hidden rounded-card bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                {/* Image */}
                <div className="relative overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        width={600}
                        height={750}
                        className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Bottom Content */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                        <h3 className="text-2xl font-bold text-white sm:text-3xl">
                            {title}
                        </h3>

                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-white/80">
                                {products} Products
                            </p>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-all duration-300 group-hover:translate-x-1 group-hover:bg-accent">
                                <ArrowRight size={18} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default CategoryCard;
