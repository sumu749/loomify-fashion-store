import { prisma } from "@/lib/prisma";

const AdminUsersPage = async () => {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Customers
                </p>

                <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                    Users
                </h1>

                <p className="mt-2 text-gray-600">
                    Manage Loomify customer accounts and roles.
                </p>
            </div>

            <div className="overflow-hidden rounded-card border border-border bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-187.5">
                        <thead className="border-b border-border bg-stone-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    User
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Email
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Role
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Joined
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="transition hover:bg-stone-50"
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-primary">
                                                {user.name}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {user.id}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.email}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                user.role === "ADMIN"
                                                    ? "bg-amber-50 text-amber-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.createdAt.toLocaleDateString(
                                            "en-US",
                                            {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            },
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-400">
                                            Coming soon
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="px-6 py-16 text-center">
                        <p className="text-gray-500">No users found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;
