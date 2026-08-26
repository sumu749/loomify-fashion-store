import Link from "next/link";
import { Heart } from "lucide-react";

import Button from "@/components/common/Button";

const EmptyWishlist = () => {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-lg text-center">
                <Heart size={70} className="mx-auto text-accent" />

                <h2 className="mt-6 text-3xl font-bold text-primary">
                    Your Wishlist is Empty
                </h2>

                <p className="mt-4 text-gray-600">
                    Save your favorite products here and shop later.
                </p>

                <div className="mt-8">
                    <Button asChild>
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default EmptyWishlist;
