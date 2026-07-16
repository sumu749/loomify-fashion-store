import { Minus, Plus, Trash2 } from "lucide-react";
import formatCurrency from "../../utils/formatCurrency";
import useCart from "../../hooks/useCart";

const CartItem = ({ item }) => {
    const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

    return (
        <div className="flex flex-col gap-5 rounded-card border border-border p-4 sm:gap-6 sm:p-5 md:flex-row md:items-center">
            <img
                src={item.image}
                alt={item.name}
                className="h-28 w-24 rounded-lg object-cover sm:h-36 sm:w-28"
            />

            <div className="flex-1">
                <p className="text-sm text-gray-500">{item.category}</p>

                <h3 className="mt-1 text-xl font-semibold">{item.name}</h3>

                <p className="mt-2 text-sm">
                    Size: <strong>{item.size}</strong>
                </p>

                <p className="text-sm">
                    Color: <strong>{item.color}</strong>
                </p>

                <p className="mt-4 text-xl font-bold">
                    {formatCurrency(item.price)}
                </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
                <button
                    onClick={() =>
                        decreaseQuantity(item.id, item.size, item.color)
                    }
                    className="rounded-lg border p-2"
                >
                    <Minus size={18} />
                </button>

                <span className="w-8 text-center">{item.quantity}</span>

                <button
                    onClick={() =>
                        increaseQuantity(item.id, item.size, item.color)
                    }
                    className="rounded-lg border p-2"
                >
                    <Plus size={18} />
                </button>
            </div>

            <button
                onClick={() => removeFromCart(item.id, item.size, item.color)}
                className="text-red-500 transition hover:scale-110"
            >
                <Trash2 size={22} />
            </button>
        </div>
    );
};

export default CartItem;
