import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../common/Button";
import formatCurrency from "../../utils/formatCurrency";
import useCart from "../../hooks/useCart";
import toast from "react-hot-toast";

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

    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();

        addToCart(product, 1);

        toast.success(`${name} added to cart`);
    };

    return (
        <motion.article
            whileHover={{ y: -8 }}
            transition={{ duration: 0.25 }}
            className="
                group
                overflow-hidden
                rounded-card
                border
                border-border
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:shadow-2xl
            "
        >
            {/* IMAGE */}

            <div className="relative overflow-hidden">
                {/* Badge */}

                {badge && (
                    <span className="absolute left-4 top-4 z-20 rounded-full bg-accent px-3 py-1 text-xs font-semibold tracking-wide text-white">
                        {badge}
                    </span>
                )}

                {/* Wishlist */}

                <button
                    className="
                        absolute
                        right-4
                        top-4
                        z-20

                        flex
                        h-10
                        w-10
                        items-center
                        justify-center

                        rounded-full
                        bg-white/90
                        shadow

                        transition-all
                        duration-300

                        hover:scale-110
                        hover:bg-accent
                        hover:text-white
                    "
                >
                    <Heart size={18} />
                </button>

                {/* IMAGE */}

                <Link to={`/products/${id}`}>
                    <img
                        src={image}
                        alt={name}
                        className="
                            aspect-4/5
                            w-full
                            object-cover

                            transition-transform
                            duration-700

                            group-hover:scale-110
                        "
                    />
                </Link>

                {/* Overlay */}

                <div
                    className="
                        absolute
                        inset-0
                        bg-linear-to-t
                        from-black/60
                        via-black/10
                        to-transparent
                        transition-all
                        duration-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                    "
                />

                {/* Hover Actions */}

                <div
                    className="
                        absolute
                        bottom-4
                        left-1/2

                        flex
                        -translate-x-1/2
                        translate-y-8
                        gap-3

                        opacity-0

                        transition-all
                        duration-500

                        group-hover:translate-y-0
                        group-hover:opacity-100
                    "
                >
                    <Link
                        to={`/products/${id}`}
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center

                            rounded-full

                            bg-white

                            transition

                            hover:bg-accent
                            hover:text-white
                        "
                    >
                        <Eye size={18} />
                    </Link>

                    <button
                        onClick={handleAddToCart}
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center

                            rounded-full

                            bg-primary
                            text-white

                            transition

                            hover:bg-accent
                        "
                    >
                        <ShoppingBag size={18} />
                    </button>
                </div>
            </div>

            {/* CONTENT */}

            <div className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                <div>
                    <p className="text-sm uppercase tracking-wider text-gray-500">
                        {category}
                    </p>

                    <Link to={`/products/${id}`}>
                        <h3 className="mt-2 text-lg font-semibold text-primary transition group-hover:text-accent sm:text-xl">
                            {name}
                        </h3>
                    </Link>
                </div>

                {/* Rating */}

                <div className="flex items-center gap-2">
                    <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="text-sm font-medium">{rating}</span>

                    <span className="text-sm text-gray-500">({reviews})</span>
                </div>

                {/* Price */}

                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-primary sm:text-2xl">
                        {formatCurrency(price)}
                    </span>

                    {oldPrice && (
                        <span className="text-gray-400 line-through">
                            {formatCurrency(oldPrice)}
                        </span>
                    )}
                </div>

                {/* Button */}

                <Button
                    onClick={handleAddToCart}
                    className="
                        w-full

                        translate-y-3
                        opacity-0

                        transition-all
                        duration-500

                        group-hover:translate-y-0
                        group-hover:opacity-100
                    "
                >
                    <ShoppingBag size={18} />
                    Add to Cart
                </Button>
            </div>
        </motion.article>
    );
};

export default ProductCard;
