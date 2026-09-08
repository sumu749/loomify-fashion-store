/* eslint-disable indent */
import Link from "next/link";
import { headers } from "next/headers";
import AdminFilterSidebar from "@/components/admin/filters/AdminFilterSidebar";
import UserFilters from "@/components/admin/users/UserFilters";
import UserRoleToggle from "@/components/admin/UserRoleToggle";
import Button from "@/components/common/Button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface AdminUsersPageProps {
    searchParams: Promise<{
        search?: string;
        role?: string;
        sort?: string;
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

const validRoles = ["ADMIN", "USER"] as const;

const AdminUsersPage = async ({ searchParams }: AdminUsersPageProps) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const params = await searchParams;

    const search = params.search?.trim() ?? "";
    const role = params.role ?? "ALL";
    const sort = params.sort ?? "newest";

    const selectedRole = validRoles.includes(
        role as (typeof validRoles)[number],
    )
        ? (role as (typeof validRoles)[number])
        : undefined;

    const where = {
        ...(selectedRole && {
            role: selectedRole,
        }),

        ...(search && {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive" as const,
                    },
                },
                {
                    email: {
                        contains: search,
                        mode: "insensitive" as const,
                    },
                },
            ],
        }),
    };

    const orderBy =
        sort === "oldest"
            ? { createdAt: "asc" as const }
            : sort === "name_asc"
              ? { name: "asc" as const }
              : sort === "name_desc"
                ? { name: "desc" as const }
                : { createdAt: "desc" as const };

    const users = await prisma.user.findMany({
        where,
        orderBy,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    const totalUsers = users.length;

    const adminUsers = users.filter((user) => user.role === "ADMIN").length;

    const customerUsers = users.filter((user) => user.role === "USER").length;

    return (
        <div className="mx-auto max-w-7xl">
            {/* ================= Header ================= */}

            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Customers
                </p>

                <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                            Users
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                            Manage Loomify customer accounts, roles, and access.
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Results
                        </p>

                        <p className="mt-1 text-xl font-bold text-primary">
                            {totalUsers}
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= Overview ================= */}

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Total Users
                    </p>

                    <p className="mt-3 text-2xl font-bold text-primary">
                        {totalUsers}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Matching current filters
                    </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">
                        Administrators
                    </p>

                    <p className="mt-3 text-2xl font-bold text-amber-800">
                        {adminUsers}
                    </p>

                    <p className="mt-1 text-xs text-amber-700/70">
                        Accounts with admin access
                    </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                        Customers
                    </p>

                    <p className="mt-3 text-2xl font-bold text-blue-800">
                        {customerUsers}
                    </p>

                    <p className="mt-1 text-xs text-blue-700/70">
                        Regular customer accounts
                    </p>
                </div>
            </div>

            {/* ================= Filters + Users ================= */}

            <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
                {/* Filter Sidebar */}

                <AdminFilterSidebar clearHref="/admin/users">
                    <UserFilters />
                </AdminFilterSidebar>

                {/* Users */}

                <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                    {/* Section Header */}

                    <div className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                Account Management
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                User Accounts
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500">
                            {totalUsers} {totalUsers === 1 ? "user" : "users"}{" "}
                            found
                        </p>
                    </div>

                    {users.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-237.5">
                                <thead className="border-b border-border bg-stone-50/80">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            User
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Email
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Role
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Joined
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {users.map((user) => {
                                        const initials =
                                            user.name?.trim().charAt(0) || "U";

                                        const isCurrentUser =
                                            user.id === session.user.id;

                                        return (
                                            <tr
                                                key={user.id}
                                                className="group transition hover:bg-stone-50/60"
                                            >
                                                {/* User */}

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-bold text-primary">
                                                            {initials.toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="font-semibold text-primary">
                                                                    {user.name}
                                                                </p>

                                                                {isCurrentUser && (
                                                                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                                                                        You
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="mt-1 max-w-55 truncate text-xs text-gray-400">
                                                                {user.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Email */}

                                                <td className="px-6 py-5">
                                                    <p className="max-w-60 truncate text-sm text-gray-600">
                                                        {user.email}
                                                    </p>
                                                </td>

                                                {/* Role */}

                                                <td className="px-6 py-5">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                                            roleStyles[
                                                                user.role
                                                            ]
                                                        }`}
                                                    >
                                                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

                                                        {roleLabels[user.role]}
                                                    </span>
                                                </td>

                                                {/* Joined */}

                                                <td className="px-6 py-5">
                                                    <p className="text-sm font-medium text-gray-700">
                                                        {user.createdAt.toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            },
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {user.createdAt.toLocaleTimeString(
                                                            "en-US",
                                                            {
                                                                hour: "numeric",
                                                                minute: "2-digit",
                                                            },
                                                        )}
                                                    </p>
                                                </td>

                                                {/* Actions */}

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Link
                                                                href={`/admin/users/${user.id}`}
                                                            >
                                                                View
                                                            </Link>
                                                        </Button>

                                                        <UserRoleToggle
                                                            userId={user.id}
                                                            role={user.role}
                                                            currentUserId={
                                                                session.user.id
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-6 py-20 text-center sm:px-8">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-xl">
                                👤
                            </div>

                            <h3 className="mt-5 text-lg font-semibold text-primary">
                                No matching users
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Try adjusting your search or role filter to find
                                the user you are looking for.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AdminUsersPage;
