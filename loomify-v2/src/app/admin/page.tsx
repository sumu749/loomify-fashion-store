import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

    return (
        <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
                Loomify Admin
            </p>

            <h1 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">
                Admin Dashboard
            </h1>

            <p className="mt-3 text-gray-600">
                Welcome back, {session.user.name}.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-card border border-border bg-white p-6">
                    <p className="text-sm text-gray-500">Total Products</p>

                    <p className="mt-2 text-3xl font-bold text-primary">
                        {stats.totalProducts}
                    </p>
                </div>

                <div className="rounded-card border border-border bg-white p-6">
                    <p className="text-sm text-gray-500">Total Users</p>

                    <p className="mt-2 text-3xl font-bold text-primary">
                        {stats.totalUsers}
                    </p>
                </div>

                <div className="rounded-card border border-border bg-white p-6">
                    <p className="text-sm text-gray-500">Total Orders</p>

                    <p className="mt-2 text-3xl font-bold text-primary">
                        {stats.totalOrders}
                    </p>
                </div>

                <div className="rounded-card border border-border bg-white p-6">
                    <p className="text-sm text-gray-500">Total Revenue</p>

                    <p className="mt-2 text-3xl font-bold text-primary">
                        {formatCurrency(stats.totalRevenue)}
                    </p>
                </div>
            </div>
        </div>
    );
}
