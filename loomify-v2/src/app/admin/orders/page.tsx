/* eslint-disable indent */
import Link from "next/link";

import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { prisma } from "@/lib/prisma";
import formatCurrency from "@/utils/formatCurrency";
import Button from "@/components/common/Button";

const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
    SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    DELIVERED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const statusLabels = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

const AdminOrdersPage = async () => {
    const orders = await prisma.order.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
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

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => order.status === "PENDING",
    ).length;

    const activeOrders = orders.filter(
        (order) =>
            order.status === "CONFIRMED" ||
            order.status === "PROCESSING" ||
            order.status === "SHIPPED",
    ).length;

    const completedOrders = orders.filter(
        (order) => order.status === "DELIVERED",
    ).length;

    return (
        <div className="mx-auto max-w-7xl">
            {/* ================= Header ================= */}

            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Sales
                </p>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                            Orders
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                            View, track, and manage customer orders from one
                            place.
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Total Orders
                        </p>

                        <p className="mt-1 text-xl font-bold text-primary">
                            {totalOrders}
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= Overview Cards ================= */}

            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                        All Orders
                    </p>

                    <p className="mt-3 text-2xl font-bold text-primary">
                        {totalOrders}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Total customer orders
                    </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm transition hover:shadow-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">
                        Pending
                    </p>

                    <p className="mt-3 text-2xl font-bold text-amber-800">
                        {pendingOrders}
                    </p>

                    <p className="mt-1 text-xs text-amber-700/70">
                        Awaiting confirmation
                    </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 shadow-sm transition hover:shadow-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                        Active
                    </p>

                    <p className="mt-3 text-2xl font-bold text-blue-800">
                        {activeOrders}
                    </p>

                    <p className="mt-1 text-xs text-blue-700/70">
                        In fulfillment
                    </p>
                </div>

                <div className="rounded-2xl border border-green-100 bg-green-50/40 p-5 shadow-sm transition hover:shadow-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-600">
                        Delivered
                    </p>

                    <p className="mt-3 text-2xl font-bold text-green-800">
                        {completedOrders}
                    </p>

                    <p className="mt-1 text-xs text-green-700/70">
                        Successfully completed
                    </p>
                </div>
            </div>

            {/* ================= Orders ================= */}

            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                {/* Section Header */}

                <div className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                            Order Management
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-primary">
                            Recent Orders
                        </h2>
                    </div>

                    <p className="text-sm text-gray-500">
                        {orders.length}{" "}
                        {orders.length === 1 ? "order" : "orders"} total
                    </p>
                </div>

                {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-275">
                            <thead className="border-b border-border bg-stone-50/80">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Order
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Items
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Total
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="group transition hover:bg-stone-50/60"
                                    >
                                        {/* Order */}

                                        <td className="px-6 py-5">
                                            <div>
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="font-semibold text-primary transition hover:text-accent"
                                                >
                                                    #
                                                    {order.id
                                                        .slice(-8)
                                                        .toUpperCase()}
                                                </Link>

                                                <p className="mt-1 max-w-45 truncate text-xs text-gray-400">
                                                    {order.id}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Customer */}

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-bold text-primary">
                                                    {order.user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="font-medium text-primary">
                                                        {order.user.name}
                                                    </p>

                                                    <p className="mt-1 max-w-50 truncate text-xs text-gray-500">
                                                        {order.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Items */}

                                        <td className="px-6 py-5 text-center">
                                            <span className="inline-flex min-w-9 items-center justify-center rounded-lg bg-stone-100 px-2.5 py-1.5 text-sm font-semibold text-primary">
                                                {order._count.items}
                                            </span>
                                        </td>

                                        {/* Total */}

                                        <td className="px-6 py-5 text-right">
                                            <p className="text-sm font-bold text-primary">
                                                {formatCurrency(
                                                    Number(order.total),
                                                )}
                                            </p>
                                        </td>

                                        {/* Status */}

                                        <td className="px-6 py-5">
                                            <div className="flex flex-col items-start gap-2">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                                        statusStyles[
                                                            order.status
                                                        ]
                                                    }`}
                                                >
                                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

                                                    {statusLabels[order.status]}
                                                </span>

                                                <OrderStatusSelect
                                                    orderId={order.id}
                                                    status={order.status}
                                                />
                                            </div>
                                        </td>

                                        {/* Date */}

                                        <td className="px-6 py-5">
                                            <p className="text-sm font-medium text-gray-700">
                                                {order.createdAt.toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    },
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                {order.createdAt.toLocaleTimeString(
                                                    "en-US",
                                                    {
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                    },
                                                )}
                                            </p>
                                        </td>

                                        {/* Action */}

                                        <td className="px-6 py-5 text-right">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                >
                                                    View
                                                    <span>→</span>
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* ================= Empty State ================= */

                    <div className="px-6 py-20 text-center sm:px-8">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-xl text-gray-400">
                            🛍
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-primary">
                            No orders yet
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            Customer orders will appear here once someone
                            completes a purchase.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminOrdersPage;
