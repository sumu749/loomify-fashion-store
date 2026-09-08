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
import { getAdminStats } from "@/services/adminService";
import formatCurrency from "@/utils/formatCurrency";

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

    const stats = await getAdminStats();

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
