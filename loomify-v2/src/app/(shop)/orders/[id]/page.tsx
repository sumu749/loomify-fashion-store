import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import formatCurrency from "@/utils/formatCurrency";

interface OrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700",
    CONFIRMED: "bg-blue-50 text-blue-700",
    PROCESSING: "bg-purple-50 text-purple-700",
    SHIPPED: "bg-indigo-50 text-indigo-700",
    DELIVERED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
};

const OrderDetailsPage = async ({ params }: OrderDetailsPageProps) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const { id } = await params;

    const order = await prisma.order.findFirst({
        where: {
            id,
            userId: session.user.id,
        },
        include: {
            items: true,
            payment: true,
        },
    });

    if (!order) {
        notFound();
    }

    return (
        <section className="bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/orders"
                    className="text-sm font-medium text-accent hover:underline"
                >
                    ← Back to Orders
                </Link>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                            Order Details
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-primary">
                            #{order.id.slice(-8).toUpperCase()}
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            {order.createdAt.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>

                    <span
                        className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                            statusStyles[order.status]
                        }`}
                    >
                        {order.status}
                    </span>
                </div>

                {/* Items */}

                <section className="mt-8 rounded-card border border-border bg-white">
                    <div className="border-b border-border p-6">
                        <h2 className="text-xl font-semibold text-primary">
                            Ordered Items
                        </h2>
                    </div>

                    <div className="divide-y divide-border">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <h3 className="font-semibold text-primary">
                                        {item.productName}
                                    </h3>

                                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                                        <p>
                                            Size:{" "}
                                            <strong className="text-primary">
                                                {item.size}
                                            </strong>
                                        </p>

                                        <p>
                                            Color:{" "}
                                            <strong className="text-primary">
                                                {item.color}
                                            </strong>
                                        </p>

                                        <p>SKU: {item.variantSku}</p>

                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                </div>

                                <p className="font-semibold text-primary">
                                    {formatCurrency(
                                        Number(item.productPrice) *
                                            item.quantity,
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {/* Shipping */}

                    <section className="rounded-card border border-border bg-white p-6">
                        <h2 className="text-xl font-semibold text-primary">
                            Shipping Address
                        </h2>

                        <div className="mt-5 space-y-2 text-sm text-gray-600">
                            {Object.entries(
                                order.shippingAddress as Record<string, string>,
                            ).map(([key, value]) => (
                                <p key={key}>
                                    <span className="font-medium capitalize text-primary">
                                        {key.replaceAll("_", " ")}:
                                    </span>{" "}
                                    {value}
                                </p>
                            ))}
                        </div>
                    </section>

                    {/* Summary */}

                    <section className="rounded-card border border-border bg-white p-6">
                        <h2 className="text-xl font-semibold text-primary">
                            Order Summary
                        </h2>

                        <div className="mt-5 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>

                                <span className="font-medium">
                                    {formatCurrency(Number(order.subtotal))}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Shipping</span>

                                <span className="font-medium">
                                    {formatCurrency(Number(order.shippingCost))}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Discount</span>

                                <span className="font-medium text-green-600">
                                    -{formatCurrency(Number(order.discount))}
                                </span>
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="flex justify-between">
                                    <span className="font-bold text-primary">
                                        Total
                                    </span>

                                    <span className="text-xl font-bold text-primary">
                                        {formatCurrency(Number(order.total))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Payment */}

                {order.payment && (
                    <section className="mt-6 rounded-card border border-border bg-white p-6">
                        <h2 className="text-xl font-semibold text-primary">
                            Payment
                        </h2>

                        <div className="mt-4 text-sm text-gray-600">
                            Status:{" "}
                            <strong className="text-primary">
                                {order.payment.status}
                            </strong>
                        </div>
                    </section>
                )}
            </div>
        </section>
    );
};

export default OrderDetailsPage;
