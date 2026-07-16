import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

const EmptyCart = () => {
    return (
        <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-stone-100">
                <ShoppingBag size={42} className="text-gray-500" />
            </div>

            <h2 className="mt-8 text-3xl font-bold text-primary">
                Your cart is empty
            </h2>

            <p className="mt-3 max-w-md text-gray-500">
                Looks like you haven't added anything yet. Explore our latest
                collection.
            </p>

            <Link to="/products" className="mt-8">
                <Button>Continue Shopping</Button>
            </Link>
        </div>
    );
};

export default EmptyCart;
