import Button from "../common/Button";
import formatCurrency from "../../utils/formatCurrency";

const CartSummary = ({ cartItems }) => {
    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );

    const shipping = subtotal > 100 ? 0 : 15;

    const total = subtotal + shipping;

    return (
        <div className="rounded-card border border-border p-6">
            <h2 className="text-2xl font-bold">Order Summary</h2>

            <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                        {shipping === 0 ? "Free" : formatCurrency(shipping)}
                    </span>
                </div>

                <hr />

                <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </div>

            <Button className="mt-8 w-full">Checkout</Button>
        </div>
    );
};

export default CartSummary;
