import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import useWishlist from "../hooks/useWishlist";
import useCart from "../hooks/useCart";

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();

    const { addToCart } = useCart();

    if (wishlistItems.length === 0) {
        return (
            <section className="py-24">
                <Container>
                    <div className="mx-auto max-w-lg text-center">
                        <Heart size={70} className="mx-auto text-accent" />

                        <h2 className="mt-6 text-3xl font-bold text-primary">
                            Your Wishlist is Empty
                        </h2>

                        <p className="mt-4 text-gray-600">
                            Save your favorite products here and shop later.
                        </p>

                        <Link to="/products">
                            <Button className="mt-8">Continue Shopping</Button>
                        </Link>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="py-20">
            <Container>
                <h1 className="mb-12 text-4xl font-bold text-primary">
                    My Wishlist
                </h1>

                <div className="space-y-6">
                    {wishlistItems.map((product) => (
                        <div
                            key={product.id}
                            className="flex flex-col gap-6 rounded-card border border-border p-6 md:flex-row md:items-center"
                        >
                            {/* Image */}

                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-36 w-28 rounded-lg object-cover"
                            />

                            {/* Info */}

                            <div className="flex-1">
                                <p className="text-sm text-gray-500">
                                    {product.category}
                                </p>

                                <h2 className="mt-2 text-2xl font-semibold">
                                    {product.name}
                                </h2>

                                <p className="mt-2 text-xl font-bold text-primary">
                                    ${product.price}
                                </p>
                            </div>

                            {/* Actions */}

                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={() => {
                                        addToCart(product);
                                        removeFromWishlist(product.id);
                                    }}
                                >
                                    Move to Cart
                                </Button>

                                <button
                                    onClick={() =>
                                        removeFromWishlist(product.id)
                                    }
                                    className="rounded-xl border border-red-200 px-5 py-3 text-red-500 transition hover:bg-red-50"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Wishlist;
