import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

const ProductCard = ({ product }) => {
    const {
        id,
        name,
        category,
        image,
        price,
        oldPrice,
        rating,
        reviews,
        badge,
    } = product;

    return (
        <article className="relative group overflow-hidden rounded-card border border-border bg-white shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            {/* Image */}

            <div className="relative overflow-hidden">
                {/* Badge */}

                {badge && (
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                        {badge}
                    </span>
                )}

                {/* Wishlist */}

                <button className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 backdrop-blur transition-all duration-300 active:scale-95 hover:bg-accent hover:text-white">
                    <Heart size={18} />
                </button>

                {/* Product Image */}

                <Link to={`/products/${id}`} className="block">
                    <img
                        src={image}
                        alt={name}
                        className="aspect-4/5 w-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                </Link>
            </div>

            {/* Content */}

            <div className="space-y-4 p-5">
                <div>
                    <p className="text-sm text-gray-500">{category}</p>

                    <Link to={`/products/${id}`}>
                        <h3 className="mt-1 text-xl font-semibold text-primary transition group-hover:text-accent">
                            {name}
                        </h3>
                    </Link>
                </div>

                {/* Price */}

                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-primary">
                        ${price}
                    </span>

                    {oldPrice && (
                        <span className="text-gray-400 line-through">
                            ${oldPrice}
                        </span>
                    )}
                </div>

                {/* Rating */}

                <div className="flex items-center gap-2">
                    <Star
                        size={18}
                        className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="text-sm font-medium">{rating}</span>

                    <span className="text-sm text-gray-500">
                        ({reviews} Reviews)
                    </span>
                </div>

                {/* Button */}

                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-white/90 p-3 backdrop-blur-md transition duration-500 group-hover:translate-y-0">
                    <Button className="w-full">
                        <ShoppingBag size={18} />
                        Add to Cart
                    </Button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
