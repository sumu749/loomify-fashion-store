import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import formatCurrency from "@/utils/formatCurrency";

interface AdminOrderDetailsPageProps {
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

const AdminOrderDetailsPage = async ({
    params,
}: AdminOrderDetailsPageProps) => {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    variant: {
                        select: {
                            id: true,
                            sku: true,
                            size: true,
                            color: true,
                        },
                    },
                },
            },
            payment: true,
        },
    });

    if (!order) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <Link
                        href="/admin/orders"
                        className="text-sm font-medium text-accent hover:underline"
                    >
                        ← Back to Orders
                    </Link>

                    <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        Order Details
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                        #{order.id.slice(-8).toUpperCase()}
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Placed on{" "}
                        {order.createdAt.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>

                <span
                    className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                        statusStyles[order.status]
                    }`}
                >
                    {order.status}
                </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Customer */}

                <section className="rounded-card border border-border bg-white p-6">
                    <h2 className="text-lg font-semibold text-primary">
                        Customer
                    </h2>

                    <div className="mt-5 space-y-3 text-sm">
                        <div>
                            <p className="text-gray-500">Name</p>

                            <p className="mt-1 font-medium">
                                {order.user.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Email</p>

                            <p className="mt-1 font-medium break-all">
                                {order.user.email}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Shipping Address */}

                <section className="rounded-card border border-border bg-white p-6">
                    <h2 className="text-lg font-semibold text-primary">
                        Shipping Address
                    </h2>

                    <div className="mt-5 text-sm leading-6 text-gray-600">
                        {Object.entries(
                            order.shippingAddress as Record<string, unknown>,
                        ).map(([key, value]) => (
                            <p key={key}>
                                <span className="font-medium capitalize text-primary">
                                    {key.replaceAll("_", " ")}:
                                </span>{" "}
                                {String(value)}
                            </p>
                        ))}
                    </div>
                </section>

                {/* Payment */}

                <section className="rounded-card border border-border bg-white p-6">
                    <h2 className="text-lg font-semibold text-primary">
                        Payment
                    </h2>

                    <div className="mt-5 space-y-3 text-sm">
                        {order.payment ? (
                            <>
                                <div>
                                    <p className="text-gray-500">Status</p>

                                    <p className="mt-1 font-medium">
                                        {order.payment.status}
                                    </p>
                                </div>

                                {order.payment.transactionId && (
                                    <div>
                                        <p className="text-gray-500">
                                            Transaction ID
                                        </p>

                                        <p className="mt-1 break-all font-medium">
                                            {order.payment.transactionId}
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-500">No payment record.</p>
                        )}
                    </div>
                </section>
            </div>

            {/* Order Items */}

            <section className="mt-6 rounded-card border border-border bg-white">
                <div className="border-b border-border p-6">
                    <h2 className="text-lg font-semibold text-primary">
                        Order Items
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-200">
                        <thead className="border-b border-border bg-stone-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Product
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Variant
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Price
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Quantity
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {order.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-primary">
                                            {item.productName}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Product ID: {item.productId}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        <p>
                                            Size: <strong>{item.size}</strong>
                                        </p>

                                        <p>
                                            Color: <strong>{item.color}</strong>
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            SKU: {item.variantSku}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium">
                                        {formatCurrency(
                                            Number(item.productPrice),
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        {item.quantity}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-semibold">
                                        {formatCurrency(
                                            Number(item.productPrice) *
                                                item.quantity,
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Summary */}

            <section className="mt-6 flex justify-end">
                <div className="w-full max-w-md rounded-card border border-border bg-white p-6">
                    <h2 className="text-lg font-semibold text-primary">
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

                        <div className="border-t border-border pt-3">
                            <div className="flex justify-between">
                                <span className="font-semibold text-primary">
                                    Total
                                </span>

                                <span className="text-xl font-bold text-primary">
                                    {formatCurrency(Number(order.total))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminOrderDetailsPage;
