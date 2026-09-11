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
        <div className="mx-auto max-w-7xl">
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

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Order Pipeline */}

                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                                Order Overview
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Order Pipeline
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Track how customer orders are moving through
                                your store.
                            </p>
                        </div>

                        <Link
                            href="/admin/orders"
                            className="text-sm font-medium text-primary transition hover:text-accent"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="mt-8">
                        {[
                            {
                                key: "PENDING",
                                label: "Pending",
                            },
                            {
                                key: "PROCESSING",
                                label: "Processing",
                            },
                            {
                                key: "SHIPPED",
                                label: "Shipped",
                            },
                            {
                                key: "DELIVERED",
                                label: "Delivered",
                            },
                        ].map((status, index, items) => {
                            const count = stats.orderStatus[status.key] ?? 0;

                            const totalOrders = stats.totalOrders || 1;

                            const percentage = Math.round(
                                (count / totalOrders) * 100,
                            );

                            return (
                                <div key={status.key}>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span
                                                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                                                    status.key === "PENDING"
                                                        ? "bg-amber-400"
                                                        : status.key ===
                                                            "PROCESSING"
                                                          ? "bg-blue-500"
                                                          : status.key ===
                                                              "SHIPPED"
                                                            ? "bg-violet-500"
                                                            : "bg-emerald-500"
                                                }`}
                                            />

                                            <span className="text-sm font-medium text-primary">
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400">
                                                {percentage}%
                                            </span>

                                            <span className="w-8 text-right text-sm font-semibold text-primary">
                                                {count}
                                            </span>
                                        </div>
                                    </div>
                                    <OrderStatusBar
                                        percentage={percentage}
                                        delay={index * 0.1}
                                        color={
                                            status.key === "PENDING"
                                                ? "bg-amber-400"
                                                : status.key === "PROCESSING"
                                                  ? "bg-blue-500"
                                                  : status.key === "SHIPPED"
                                                    ? "bg-violet-500"
                                                    : "bg-emerald-500"
                                        }
                                    />

                                    {index < items.length - 1 && (
                                        <div className="my-5 border-b border-border" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Cancelled */}
                    <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                        <div>
                            <p className="text-sm font-medium text-primary">
                                Cancelled Orders
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Orders removed from active fulfillment.
                            </p>
                        </div>

                        <span className="text-lg font-bold text-primary">
                            {stats.orderStatus.CANCELLED ?? 0}
                        </span>
                    </div>
                </div>

                {/* Recent Orders */}

                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
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
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full min-w-180 text-left">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="pb-4 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-gray-400">
                                            Order
                                        </th>

                                        <th className="pb-4 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-gray-400">
                                            Customer
                                        </th>

                                        <th className="pb-4 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-gray-400">
                                            Total
                                        </th>

                                        <th className="pb-4 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-gray-400">
                                            Status
                                        </th>

                                        <th className="pb-4 text-right text-xs font-medium uppercase tracking-[0.15em] text-gray-400">
                                            Date
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentOrders.map((order) => {
                                        const statusStyles: Record<
                                            string,
                                            string
                                        > = {
                                            PENDING:
                                                "bg-amber-50 text-amber-700 border-amber-200",
                                            PROCESSING:
                                                "bg-blue-50 text-blue-700 border-blue-200",
                                            SHIPPED:
                                                "bg-violet-50 text-violet-700 border-violet-200",
                                            DELIVERED:
                                                "bg-emerald-50 text-emerald-700 border-emerald-200",
                                            CANCELLED:
                                                "bg-red-50 text-red-700 border-red-200",
                                        };

                                        return (
                                            <tr
                                                key={order.id}
                                                className="group border-b border-border last:border-b-0"
                                            >
                                                <td className="py-4 pr-4">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors group-hover:text-accent"
                                                    >
                                                        #{order.id.slice(-8)}
                                                        <ArrowRight
                                                            size={14}
                                                            className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                                                        />
                                                    </Link>
                                                </td>

                                                <td className="py-4 pr-4">
                                                    <p className="text-sm font-medium text-primary">
                                                        {order.user.name ||
                                                            "Customer"}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-gray-400">
                                                        {order.user.email}
                                                    </p>
                                                </td>

                                                <td className="py-4 pr-4 text-sm font-semibold text-primary">
                                                    {formatCurrency(
                                                        Number(order.total),
                                                    )}
                                                </td>

                                                <td className="py-4 pr-4">
                                                    <span
                                                        className={`inline-flex border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                                                            statusStyles[
                                                                order.status
                                                            ] ??
                                                            "border-border bg-stone-50 text-gray-600"
                                                        }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>

                                                <td className="py-4 text-right text-xs text-gray-400">
                                                    {new Date(
                                                        order.createdAt,
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-sm text-gray-500">
                                No orders have been placed yet.
                            </p>

                            <Link
                                href="/admin/orders"
                                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-accent"
                            >
                                Go to Orders
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ================= Top Products ================= */}

            <section className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
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
                    <div className="mt-7 space-y-5">
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
                                    className="group block"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Rank */}
                                        <span className="w-6 shrink-0 text-xs font-semibold tracking-wider text-gray-300">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        {/* Product Image */}
                                        <div className="h-14 w-11 shrink-0 overflow-hidden bg-stone-100">
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
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="truncate text-sm font-medium text-primary transition-colors group-hover:text-accent">
                                                    {product.name}
                                                </p>

                                                <span className="shrink-0 text-sm font-semibold text-primary">
                                                    {product.sold} sold
                                                </span>
                                            </div>

                                            <div className="mt-2 h-1.5 overflow-hidden bg-stone-100">
                                                <div
                                                    className="h-full bg-accent transition-all duration-700 group-hover:bg-primary"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <span className="hidden w-20 shrink-0 text-right text-sm text-gray-500 sm:block">
                                            {formatCurrency(product.price)}
                                        </span>

                                        <ArrowRight
                                            size={16}
                                            className="shrink-0 text-gray-300 transition duration-300 group-hover:translate-x-1 group-hover:text-primary"
                                        />
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
