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
        <section className="py-16 sm:py-20">
            <Container>
                <h1 className="text-3xl font-bold text-primary sm:text-4xl">
                    Shopping Cart
                </h1>

                <div className="mt-8 grid gap-8 sm:mt-14 lg:grid-cols-[2fr_1fr] lg:gap-12">
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
