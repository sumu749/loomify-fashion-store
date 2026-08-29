import { prisma } from "@/lib/prisma";
import formatCurrency from "@/utils/formatCurrency";
import Link from "next/dist/client/link";

import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

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

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}

            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Sales
                </p>

                <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                    Orders
                </h1>

                <p className="mt-2 text-gray-600">
                    View and manage customer orders.
                </p>
            </div>

            {/* Orders Table */}

            <div className="overflow-hidden rounded-card border border-border bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-237.5">
                        <thead className="border-b border-border bg-stone-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Order
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Customer
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Items
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Total
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Date
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="transition hover:bg-stone-50"
                                >
                                    {/* Order */}

                                    <td className="px-6 py-4">
                                        <p className="font-medium text-primary">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            {order.id}
                                        </p>
                                    </td>

                                    {/* Customer */}

                                    <td className="px-6 py-4">
                                        <p className="font-medium text-primary">
                                            {order.user.name}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {order.user.email}
                                        </p>
                                    </td>

                                    {/* Items */}

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {order._count.items}
                                    </td>

                                    {/* Total */}

                                    <td className="px-6 py-4 text-sm font-semibold text-primary">
                                        {formatCurrency(Number(order.total))}
                                    </td>

                                    {/* Status */}

                                    <td className="px-6 py-4">
                                        <div className="flex justify-end">
                                            <OrderStatusSelect
                                                orderId={order.id}
                                                status={order.status}
                                            />
                                        </div>
                                    </td>

                                    {/* Date */}

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {order.createdAt.toLocaleDateString(
                                            "en-US",
                                            {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            },
                                        )}
                                    </td>

                                    {/* Actions */}

                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="text-sm font-medium text-accent hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div className="px-6 py-16 text-center">
                        <p className="text-gray-500">No orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrdersPage;
