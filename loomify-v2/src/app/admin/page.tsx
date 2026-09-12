/* eslint-disable indent */
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
import OrderStatusBar from "@/components/admin/OrderStatusBar";

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
        <div className="mx-auto w-full min-w-0 max-w-7xl">
            {/* ================= Header ================= */}

            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 lg:p-10">
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

                    <div className="flex flex-wrap items-center gap-2">
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

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.label}
                                className="rounded-2xl border border-border bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            {card.label}
                                        </p>

                                        <p className="mt-3 text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
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

            <section className="mt-8 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
                {/* Order Pipeline */}

                <div className="w-full rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                                Order Overview
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Order Pipeline
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-gray-500">
                                Track customer orders through each stage.
                            </p>
                        </div>

                        <Link
                            href="/admin/orders"
                            className="shrink-0 text-sm font-medium text-primary transition hover:text-accent"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="mt-7 space-y-5">
                        {[
                            {
                                key: "PENDING",
                                label: "Pending",
                                color: "bg-amber-400",
                            },
                            {
                                key: "PROCESSING",
                                label: "Processing",
                                color: "bg-purple-500",
                            },
                            {
                                key: "SHIPPED",
                                label: "Shipped",
                                color: "bg-blue-500",
                            },
                            {
                                key: "DELIVERED",
                                label: "Delivered",
                                color: "bg-green-500",
                            },
                        ].map((status, index) => {
                            const count = stats.orderStatus[status.key] ?? 0;

                            const cancelledOrders =
                                stats.orderStatus.CANCELLED ?? 0;

                            const activeOrders = Math.max(
                                stats.totalOrders - cancelledOrders,
                                0,
                            );

                            const percentage =
                                activeOrders > 0
                                    ? Math.round((count / activeOrders) * 100)
                                    : 0;

                            return (
                                <div key={status.key}>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <span
                                                className={`h-2 w-2 shrink-0 rounded-full ${status.color}`}
                                            />

                                            <span className="truncate text-sm font-medium text-primary">
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">
                                            <span className="text-sm font-semibold text-primary">
                                                {count}
                                            </span>

                                            <span className="text-xs text-gray-400">
                                                {percentage}%
                                            </span>
                                        </div>
                                    </div>

                                    <OrderStatusBar
                                        percentage={percentage}
                                        color={status.color}
                                        delay={index * 0.08}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Cancelled */}
                    <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
                        <div className="flex items-center gap-2.5">
                            <span className="h-2 w-2 rounded-full bg-red-400" />

                            <span className="text-sm font-medium text-gray-600">
                                Cancelled Orders
                            </span>
                        </div>

                        <span className="text-sm font-semibold text-primary">
                            {stats.orderStatus.CANCELLED ?? 0}
                        </span>
                    </div>
                </div>

                {/* Recent Orders */}

                <div className="w-full rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                                Recent Activity
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Recent Orders
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Latest customer orders and their current status.
                            </p>
                        </div>

                        <Link
                            href="/admin/orders"
                            className="shrink-0 text-sm font-medium text-primary transition hover:text-accent"
                        >
                            View all
                        </Link>
                    </div>

                    {recentOrders.length > 0 ? (
                        <>
                            {/* Desktop Table */}
                            <div className="mt-6 hidden overflow-x-auto sm:block">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border text-xs uppercase tracking-wider text-gray-400">
                                            <th className="w-[20%] pb-4 font-medium">
                                                Order
                                            </th>
                                            <th className="w-[30%] pb-4 font-medium">
                                                Customer
                                            </th>
                                            <th className="w-[15%] pb-4 font-medium">
                                                Total
                                            </th>
                                            <th className="w-[16%] pb-4 font-medium">
                                                Status
                                            </th>
                                            <th className="w-[18%] pb-4 text-right font-medium">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-border">
                                        {recentOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="transition hover:bg-stone-50"
                                            >
                                                <td className="py-4">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="font-medium text-primary hover:text-accent"
                                                    >
                                                        #
                                                        {order.id
                                                            .slice(-8)
                                                            .toUpperCase()}
                                                    </Link>
                                                </td>

                                                <td className="py-4">
                                                    <div>
                                                        <p className="font-medium text-primary">
                                                            {order.user.name}
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            {order.user.email}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="py-4 font-medium text-primary">
                                                    $
                                                    {Number(
                                                        order.total,
                                                    ).toFixed(2)}
                                                </td>

                                                <td className="py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                            order.status ===
                                                            "DELIVERED"
                                                                ? "bg-green-50 text-green-700"
                                                                : order.status ===
                                                                    "CANCELLED"
                                                                  ? "bg-red-50 text-red-700"
                                                                  : order.status ===
                                                                      "SHIPPED"
                                                                    ? "bg-blue-50 text-blue-700"
                                                                    : order.status ===
                                                                        "PROCESSING"
                                                                      ? "bg-purple-50 text-purple-700"
                                                                      : "bg-amber-50 text-amber-700"
                                                        }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>

                                                <td className="py-4 text-right text-sm text-gray-500">
                                                    {new Date(
                                                        order.createdAt,
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="mt-6 space-y-3 sm:hidden">
                                {recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/admin/orders/${order.id}`}
                                        className="block rounded-xl border border-border p-4 transition hover:border-accent hover:bg-stone-50"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-primary">
                                                    #
                                                    {order.id
                                                        .slice(-8)
                                                        .toUpperCase()}
                                                </p>

                                                <p className="mt-1 truncate text-sm text-gray-600">
                                                    {order.user.name}
                                                </p>

                                                <p className="truncate text-xs text-gray-400">
                                                    {order.user.email}
                                                </p>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                                    order.status === "DELIVERED"
                                                        ? "bg-green-50 text-green-700"
                                                        : order.status ===
                                                            "CANCELLED"
                                                          ? "bg-red-50 text-red-700"
                                                          : order.status ===
                                                              "SHIPPED"
                                                            ? "bg-blue-50 text-blue-700"
                                                            : order.status ===
                                                                "PROCESSING"
                                                              ? "bg-purple-50 text-purple-700"
                                                              : "bg-amber-50 text-amber-700"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                                    Total
                                                </p>
                                                <p className="mt-0.5 font-semibold text-primary">
                                                    $
                                                    {Number(
                                                        order.total,
                                                    ).toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                                    Date
                                                </p>
                                                <p className="mt-0.5 text-sm text-gray-500">
                                                    {new Date(
                                                        order.createdAt,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="mt-6 rounded-xl border border-dashed border-border py-10 text-center">
                            <p className="text-sm text-gray-500">
                                No recent orders found.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ================= Top Products ================= */}

            <section className="w-full rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                            Product Performance
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-primary">
                            Top Products
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Best-selling products based on order quantity.
                        </p>
                    </div>

                    <Link
                        href="/admin/products"
                        className="shrink-0 text-sm font-medium text-primary transition hover:text-accent"
                    >
                        Manage products
                    </Link>
                </div>

                {topProducts.length > 0 ? (
                    <div className="mt-6 space-y-4">
                        {topProducts.map((product, index) => {
                            const maxSold = Math.max(
                                ...topProducts.map((item) => item.sold),
                                1,
                            );

                            const percentage = Math.round(
                                (product.sold / maxSold) * 100,
                            );

                            return (
                                <Link
                                    key={product.id}
                                    href={`/admin/products/${product.id}`}
                                    className="group flex items-center gap-3 rounded-xl border border-border p-3 transition hover:border-accent hover:bg-stone-50 sm:gap-4 sm:p-4"
                                >
                                    {/* Product Image */}
                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-stone-100 sm:h-12 sm:w-12">
                                        {product.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="truncate text-sm font-medium text-primary">
                                                {product.name}
                                            </p>

                                            <span className="shrink-0 text-xs font-medium text-gray-500">
                                                {product.sold} sold
                                            </span>
                                        </div>

                                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
                                            <div
                                                className="h-full rounded-full bg-primary"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="shrink-0 text-right">
                                        <p className="text-sm font-semibold text-primary">
                                            ${Number(product.price).toFixed(2)}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            #{index + 1}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-sm text-gray-500">
                            No product sales data yet.
                        </p>
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
