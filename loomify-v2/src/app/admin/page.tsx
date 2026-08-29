import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

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
        </div>
    );
}
