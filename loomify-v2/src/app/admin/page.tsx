import Link from "next/link";
import {
    ArrowRight,
    FolderTree,
    Package,
    Plus,
    ShoppingBag,
    Users,
} from "lucide-react";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Button from "@/components/common/Button";
import { auth } from "@/lib/auth";
import {
    getAdminRecentOrders,
    getAdminSalesOverview,
    getAdminStats,
    getAdminTopProducts,
} from "@/services/adminService";
import formatCurrency from "@/utils/formatCurrency";
import SalesOverviewChart from "@/components/admin/SalesOverviewChart";

export default async function AdminPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/unauthorized");
    }

    const [stats, recentOrders, topProducts, salesOverview] = await Promise.all(
        [
            getAdminStats(),
            getAdminRecentOrders(),
            getAdminTopProducts(),
            getAdminSalesOverview(),
        ],
    );

    const statCards = [
        {
            label: "Total Products",
            value: stats.totalProducts,
            description: "Products in your catalog",
            icon: Package,
            iconWrapper: "bg-stone-100 text-primary",
        },
        {
            label: "Total Users",
            value: stats.totalUsers,
            description: "Registered customer accounts",
            icon: Users,
            iconWrapper: "bg-blue-50 text-blue-700",
        },
        {
            label: "Total Orders",
            value: stats.totalOrders,
            description: "Orders placed by customers",
            icon: ShoppingBag,
            iconWrapper: "bg-amber-50 text-amber-700",
        },
        {
            label: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            description: "Revenue generated from orders",
            icon: FolderTree,
            iconWrapper: "bg-green-50 text-green-700",
        },
    ];

    const managementLinks = [
        {
            title: "Products",
            description: "Manage products, variants and inventory.",
            href: "/admin/products",
            icon: Package,
        },
        {
            title: "Orders",
            description: "Review orders and update fulfillment status.",
            href: "/admin/orders",
            icon: ShoppingBag,
        },
        {
            title: "Categories",
            description: "Organize your product catalog.",
            href: "/admin/categories",
            icon: FolderTree,
        },
        {
            title: "Users",
            description: "Manage customer accounts and roles.",
            href: "/admin/users",
            icon: Users,
        },
    ];

    return (
        <div className="mx-auto max-w-7xl">
            {/* ================= Header ================= */}

            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <div className="relative p-6 sm:p-8 lg:p-10">
                    <div className="max-w-3xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                            Loomify Admin
                        </p>

                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                            Admin Dashboard
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
                            Welcome back,{" "}
                            <span className="font-semibold text-primary">
                                {session.user.name}
                            </span>
                            . Here&apos;s an overview of your Loomify store.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button asChild>
                            <Link href="/admin/products/new">
                                <Plus size={18} />
                                Add Product
                            </Link>
                        </Button>

                        <Button asChild variant="outline">
                            <Link href="/admin/orders">
                                View Orders
                                <ArrowRight size={17} />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* ================= Stats ================= */}

            <section className="mt-8">
                <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        Store Overview
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-primary">
                        At a glance
                    </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.label}
                                className="rounded-2xl border border-border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            {card.label}
                                        </p>

                                        <p className="mt-3 text-3xl font-bold tracking-tight text-primary">
                                            {card.value}
                                        </p>
                                    </div>

                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconWrapper}`}
                                    >
                                        <Icon size={20} />
                                    </div>
                                </div>

                                <p className="mt-4 text-xs leading-5 text-gray-400">
                                    {card.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ================= Sales Overview ================= */}

            <section className="mt-8">
                <SalesOverviewChart data={salesOverview} />
            </section>

            {/* ================= Dashboard Insights ================= */}

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Order Status */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                                Orders
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Order Status
                            </h2>
                        </div>

                        <Link
                            href="/admin/orders"
                            className="text-sm font-medium text-primary transition hover:text-accent"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {[
                            {
                                label: "Pending",
                                value: stats.orderStatus.PENDING ?? 0,
                            },
                            {
                                label: "Processing",
                                value: stats.orderStatus.PROCESSING ?? 0,
                            },
                            {
                                label: "Shipped",
                                value: stats.orderStatus.SHIPPED ?? 0,
                            },
                            {
                                label: "Delivered",
                                value: stats.orderStatus.DELIVERED ?? 0,
                            },
                            {
                                label: "Cancelled",
                                value: stats.orderStatus.CANCELLED ?? 0,
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="border border-border bg-stone-50 p-4"
                            >
                                <p className="text-xs text-gray-500">
                                    {item.label}
                                </p>

                                <p className="mt-2 text-2xl font-bold text-primary">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                                Recent Activity
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Recent Orders
                            </h2>
                        </div>

                        <Link
                            href="/admin/orders"
                            className="text-sm font-medium text-primary transition hover:text-accent"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="mt-6 space-y-4">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/admin/orders/${order.id}`}
                                    className="block border-b border-border pb-4 transition last:border-b-0 last:pb-0 hover:pl-1"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-primary">
                                                {order.user.name || "Customer"}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                {order.user.email}
                                            </p>
                                        </div>

                                        <span className="shrink-0 text-sm font-semibold text-primary">
                                            {formatCurrency(
                                                Number(order.total),
                                            )}
                                        </span>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">
                                            {new Date(
                                                order.createdAt,
                                            ).toLocaleDateString()}
                                        </span>

                                        <span className="text-xs font-medium uppercase tracking-wide text-accent">
                                            {order.status}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="py-8 text-center text-sm text-gray-500">
                                No orders yet.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* ================= Top Products ================= */}

            <section className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                            Product Performance
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-primary">
                            Top Products
                        </h2>
                    </div>

                    <Link
                        href="/admin/products"
                        className="text-sm font-medium text-primary transition hover:text-accent"
                    >
                        Manage products
                    </Link>
                </div>

                {topProducts.length > 0 ? (
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full min-w-150 text-left">
                            <thead>
                                <tr className="border-b border-border text-xs uppercase tracking-[0.16em] text-gray-400">
                                    <th className="pb-4 font-medium">
                                        Product
                                    </th>

                                    <th className="pb-4 font-medium">Price</th>

                                    <th className="pb-4 text-right font-medium">
                                        Sold
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {topProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-border last:border-0"
                                    >
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-10 overflow-hidden bg-stone-100">
                                                    {product.image ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-stone-100" />
                                                    )}
                                                </div>

                                                <span className="max-w-65 truncate text-sm font-medium text-primary">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-4 text-sm text-gray-500">
                                            {formatCurrency(product.price)}
                                        </td>

                                        <td className="py-4 text-right text-sm font-semibold text-primary">
                                            {product.sold}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-10 text-center text-sm text-gray-500">
                        No product sales data yet.
                    </div>
                )}
            </section>

            {/* ================= Management ================= */}

            <section className="mt-8">
                <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        Management
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-primary">
                        Store management
                    </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {managementLinks.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-5">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-primary transition group-hover:bg-primary group-hover:text-white">
                                            <Icon size={20} />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-primary">
                                                {item.title}
                                            </h3>

                                            <p className="mt-1 text-sm leading-6 text-gray-500">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    <ArrowRight
                                        size={18}
                                        className="mt-1 shrink-0 text-gray-300 transition duration-300 group-hover:translate-x-1 group-hover:text-primary"
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* ================= Quick Actions ================= */}

            <section className="mt-8 mb-2 rounded-2xl border border-border bg-stone-50 p-6 sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                            Quick Actions
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-primary">
                            Keep your store moving
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                            Add new products, organize categories, or review
                            incoming customer orders from the admin panel.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild size="sm">
                            <Link href="/admin/products/new">
                                <Plus size={16} />
                                New Product
                            </Link>
                        </Button>

                        <Button asChild variant="secondary" size="sm">
                            <Link href="/admin/categories/new">
                                <Plus size={16} />
                                New Category
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
