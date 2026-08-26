"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import EmptyWishlist from "@/components/wishlist/EmptyWishlist";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";

import formatCurrency from "@/utils/formatCurrency";
import { removeFromWishlist } from "@/features/wishlist/wishlistSlice";

import { addToCart } from "@/features/cart/cartSlice";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

const WishlistPage = () => {
    const dispatch = useAppDispatch();

    const wishlistItems = useAppSelector((state) => state.wishlist.items);

    const handleMoveToCart = (product: (typeof wishlistItems)[number]) => {
        dispatch(
            addToCart({
                product,
                quantity: 1,
            }),
        );

        dispatch(removeFromWishlist(product.id));

        toast.success("Moved to Cart");
    };

    const handleRemove = (id: number) => {
        dispatch(removeFromWishlist(id));

        toast.success("Removed from Wishlist");
    };

    if (wishlistItems.length === 0) {
        return <EmptyWishlist />;
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
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={112}
                                height={144}
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
                                    {formatCurrency(product.price)}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={() => handleMoveToCart(product)}
                                >
                                    Move to Cart
                                </Button>

                                <button
                                    type="button"
                                    onClick={() => handleRemove(product.id)}
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

export default WishlistPage;
