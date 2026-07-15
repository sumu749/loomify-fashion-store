import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
    const { title, image, products } = category;

    return (
        <Link
            to={`/products?category=${title.toLowerCase()}`}
            className="group block"
        >
            <article className="overflow-hidden rounded-card bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                {/* Image */}

                <div className="relative overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}

                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent"></div>

                    {/* Bottom Content */}

                    <div className="absolute inset-x-0 bottom-0 p-6">
                        <h3 className="text-3xl font-bold text-white">
                            {title}
                        </h3>

                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-white/80">
                                {products} Products
                            </p>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-all duration-300 group-hover:bg-accent group-hover:translate-x-1">
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
