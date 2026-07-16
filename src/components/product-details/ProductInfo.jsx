import { Star } from "lucide-react";
import formatCurrency from "../../utils/formatCurrency";

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

            <h1 className="mt-2 text-4xl font-bold text-primary">{name}</h1>

            <div className="mt-6 flex items-center gap-2">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />

                <span>{rating}</span>

                <span className="text-gray-400">({reviews} Reviews)</span>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <span className="text-4xl font-bold text-primary">
                    {formatCurrency(price)}
                </span>

                {oldPrice && (
                    <span className="text-xl text-gray-400 line-through">
                        {formatCurrency(oldPrice)}
                    </span>
                )}
            </div>

            <p className="mt-8 leading-8 text-gray-600">{description}</p>
        </div>
    );
};

export default ProductInfo;
