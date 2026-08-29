import Link from "next/link";

import Button from "@/components/common/Button";

interface OrderSuccessPageProps {
    searchParams: Promise<{
        orderId?: string;
    }>;
}

const OrderSuccessPage = async ({ searchParams }: OrderSuccessPageProps) => {
    const { orderId } = await searchParams;

    return (
        <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
            <div className="max-w-xl text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
                    ✓
                </div>

                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Order Confirmed
                </p>

                <h1 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">
                    Thank You for Your Order!
                </h1>

                <p className="mt-4 text-gray-600">
                    Your order has been placed successfully.
                </p>

                {orderId && (
                    <p className="mt-4 text-sm text-gray-500">
                        Order ID:{" "}
                        <span className="font-semibold text-primary">
                            {orderId}
                        </span>
                    </p>
                )}

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button asChild>
                        <Link href="/products">Continue Shopping</Link>
                    </Button>

                    <Button asChild variant="outline">
                        <Link href="/orders">View Orders</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default OrderSuccessPage;
