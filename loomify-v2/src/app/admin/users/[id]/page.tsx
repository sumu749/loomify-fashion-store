import Link from "next/link";
import { notFound } from "next/navigation";

import Button from "@/components/common/Button";
import { prisma } from "@/lib/prisma";
import formatCurrency from "@/utils/formatCurrency";

interface AdminUserDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

const roleStyles = {
    ADMIN: "border-amber-200 bg-amber-50 text-amber-700",
    USER: "border-gray-200 bg-gray-100 text-gray-600",
};

const roleLabels = {
    ADMIN: "Administrator",
    USER: "Customer",
};

const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700",
    CONFIRMED: "bg-blue-50 text-blue-700",
    PROCESSING: "bg-purple-50 text-purple-700",
    SHIPPED: "bg-indigo-50 text-indigo-700",
    DELIVERED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
};

const AdminUserDetailsPage = async ({ params }: AdminUserDetailsPageProps) => {
    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,

            _count: {
                select: {
                    orders: true,
                    addresses: true,
                },
            },

            orders: {
                select: {
                    id: true,
                    status: true,
                    total: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            },
        },
    });

    if (!user) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}

            <div className="mb-8">
                <Link
                    href="/admin/users"
                    className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-primary"
                >
                    <span className="mr-2">←</span>
                    Back to Users
                </Link>

                <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xl font-bold text-primary">
                                {user.name.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                    User Details
                                </p>

                                <h1 className="mt-1 text-2xl font-bold text-primary sm:text-3xl">
                                    {user.name}
                                </h1>

                                <p className="mt-1 text-sm text-gray-500">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <span
                            className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-xs font-semibold ${
                                roleStyles[user.role]
                            }`}
                        >
                            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
                            {roleLabels[user.role]}
                        </span>
                    </div>
                </div>
            </div>

            {/* Account Information */}

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        Profile
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-primary">
                        Account Information
                    </h2>

                    <div className="mt-6 space-y-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Name
                            </p>

                            <p className="mt-1 font-medium text-primary">
                                {user.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Email
                            </p>

                            <p className="mt-1 break-all text-sm text-gray-700">
                                {user.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Joined
                            </p>

                            <p className="mt-1 text-sm text-gray-700">
                                {user.createdAt.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Orders */}

                <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        Orders
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-primary">
                        Order Activity
                    </h2>

                    <p className="mt-6 text-4xl font-bold text-primary">
                        {user._count.orders}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Total orders placed by this user
                    </p>
                </section>

                {/* Addresses */}

                <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        Addresses
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-primary">
                        Saved Addresses
                    </h2>

                    <p className="mt-6 text-4xl font-bold text-primary">
                        {user._count.addresses}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Saved delivery addresses
                    </p>
                </section>
            </div>

            {/* Recent Orders */}

            <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                            Activity
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-primary">
                            Recent Orders
                        </h2>
                    </div>

                    <span className="text-sm text-gray-500">
                        Latest 5 orders
                    </span>
                </div>

                {user.orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-175">
                            <thead className="border-b border-border bg-stone-50/80">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Order
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Total
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
                                {user.orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="transition hover:bg-stone-50/60"
                                    >
                                        <td className="px-6 py-5">
                                            <span className="font-semibold text-primary">
                                                #
                                                {order.id
                                                    .slice(-8)
                                                    .toUpperCase()}
                                            </span>

                                            <p className="mt-1 text-xs text-gray-400">
                                                {order.id}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    statusStyles[order.status]
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 text-right text-sm font-semibold text-primary">
                                            {formatCurrency(
                                                Number(order.total),
                                            )}
                                        </td>

                                        <td className="px-6 py-5 text-sm text-gray-600">
                                            {order.createdAt.toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                },
                                            )}
                                        </td>

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
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-lg">
                            🛍
                        </div>

                        <p className="mt-4 text-sm font-medium text-primary">
                            No orders yet
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            This user has not placed any orders.
                        </p>
                    </div>
                )}
            </section>

            {/* User ID */}

            <section className="mt-6 rounded-2xl border border-border bg-stone-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                    User ID
                </p>

                <p className="mt-2 break-all font-mono text-xs text-gray-600">
                    {user.id}
                </p>
            </section>
        </div>
    );
};

export default AdminUserDetailsPage;
