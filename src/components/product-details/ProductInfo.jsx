import { Star } from "lucide-react";
import formatCurrency from "../../utils/formatCurrency";
import ProductActions from "./ProductActions";
const ProductInfo = ({ product }) => {
    const {
        badge,
        category,
        name,
        rating,
        reviews,
        price,
        oldPrice,
        description,
    } = product;

    return (
        <div className="flex flex-col">
            {badge && (
                <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                    {badge}
                </span>
            )}

            <p className="mt-5 text-sm uppercase tracking-widest text-gray-500">
                {category}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                {name}
            </h1>

            <div className="mt-4 flex items-center gap-2">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />

                <span>{rating}</span>

                <span className="text-gray-400">({reviews} Reviews)</span>
            </div>

            <div className="mt-6 flex items-center gap-4">
                <span className="text-3xl font-bold text-primary sm:text-4xl">
                    {formatCurrency(price)}
                </span>

                {oldPrice && (
                    <span className="text-lg text-gray-400 line-through sm:text-xl">
                        {formatCurrency(oldPrice)}
                    </span>
                )}
            </div>

            <p className="mt-6 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                {description}
            </p>
            <ProductActions product={product} />
        </div>
    );
};

export default ProductInfo;
