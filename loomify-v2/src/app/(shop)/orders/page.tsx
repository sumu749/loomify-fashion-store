import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import formatCurrency from "@/utils/formatCurrency";
import Button from "@/components/common/Button";

const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700",
    CONFIRMED: "bg-blue-50 text-blue-700",
    PROCESSING: "bg-purple-50 text-purple-700",
    SHIPPED: "bg-indigo-50 text-indigo-700",
    DELIVERED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
};

const OrdersPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const orders = await prisma.order.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            _count: {
                select: {
                    items: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <section className="bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        My Account
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                        My Orders
                    </h1>

                    <p className="mt-3 text-gray-600">
                        View and track your previous orders.
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-card border border-border bg-white px-6 py-16 text-center">
                        <h2 className="text-xl font-semibold text-primary">
                            No orders yet
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Your completed orders will appear here.
                        </p>

                        <div className="mt-6">
                            <Button asChild>
                                <Link href="/products">Start Shopping</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-card border border-border bg-white p-5 sm:p-6"
                            >
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Order
                                        </p>

                                        <h2 className="mt-1 text-lg font-bold text-primary">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {order.createdAt.toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                },
                                            )}
                                        </p>
                                    </div>

                                    <span
                                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                            statusStyles[order.status]
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Items
                                        </p>

                                        <p className="mt-1 font-medium text-primary">
                                            {order._count.items}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Total
                                        </p>

                                        <p className="mt-1 font-semibold text-primary">
                                            {formatCurrency(
                                                Number(order.total),
                                            )}
                                        </p>
                                    </div>

                                    <div className="sm:text-right">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Link href={`/orders/${order.id}`}>
                                                View Order
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default OrdersPage;
