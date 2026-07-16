/* eslint-disable indent */
import { useState } from "react";
import { Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import Button from "../common/Button";
import useCart from "../../hooks/useCart";

const ProductActions = ({ product }) => {
    const { sizes, colors, inStock } = product;
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [quantity, setQuantity] = useState(1);

    const increase = () => setQuantity((prev) => prev + 1);

    const decrease = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    return (
        <div className="mt-8 space-y-8">
            {/* Size */}
            <div>
                <h3 className="mb-3 font-semibold text-primary">Select Size</h3>

                <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`h-10 w-10 rounded-lg border transition
                                ${
                                    selectedSize === size
                                        ? "border-primary bg-primary text-white"
                                        : "border-border hover:border-primary"
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color */}
            <div>
                <h3 className="mb-3 font-semibold text-primary">
                    Select Color
                </h3>

                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`rounded-full border px-3 py-2 transition
                                ${
                                    selectedColor === color
                                        ? "border-primary bg-primary text-white"
                                        : "border-border hover:border-primary"
                                }`}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quantity */}
            <div>
                <h3 className="mb-3 font-semibold text-primary">Quantity</h3>

                <div className="flex w-fit items-center rounded-lg border border-border">
                    <button
                        onClick={decrease}
                        className="p-3 hover:bg-gray-100"
                    >
                        <Minus size={18} />
                    </button>

                    <span className="w-12 text-center font-semibold">
                        {quantity}
                    </span>

                    <button
                        onClick={increase}
                        className="p-3 hover:bg-gray-100"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
                <Button
                    onClick={() =>
                        addToCart(
                            product,
                            quantity,
                            selectedSize,
                            selectedColor,
                        )
                    }
                    className="flex-1"
                >
                    Add To Cart
                </Button>

                <button
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-border
                        transition
                        hover:border-primary
                    "
                >
                    <Heart size={20} />
                </button>
            </div>

            {/* Extra Info */}
            <div className="space-y-2 rounded-card bg-stone-50 p-2">
                <div className="flex items-center gap-3">
                    <Truck size={18} />
                    <span>Free Shipping Worldwide</span>
                </div>

                <div className="flex items-center gap-3">
                    <ShieldCheck size={18} />
                    <span>{inStock ? "In Stock" : "Out of Stock"}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductActions;
