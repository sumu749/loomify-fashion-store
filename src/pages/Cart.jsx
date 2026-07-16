import Container from "../components/common/Container";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";
import useCart from "../hooks/useCart";

const Cart = () => {
    const { cartItems } = useCart();

    if (!cartItems.length) {
        return (
            <Container>
                <EmptyCart />
            </Container>
        );
    }

    return (
        <section className="py-20">
            <Container>
                <h1 className="text-4xl font-bold text-primary">
                    Shopping Cart
                </h1>

                <div className="mt-14 grid gap-12 lg:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <CartItem
                                key={`${item.id}-${item.size}-${item.color}`}
                                item={item}
                            />
                        ))}
                    </div>

                    <CartSummary cartItems={cartItems} />
                </div>
            </Container>
        </section>
    );
};

export default Cart;
