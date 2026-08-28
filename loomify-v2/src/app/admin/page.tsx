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
        <section className="min-h-screen bg-stone-50 px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
                    Loomify Admin
                </p>

                <h1 className="mt-3 text-4xl font-bold text-primary">
                    Admin Dashboard
                </h1>

                <p className="mt-3 text-gray-600">
                    Welcome back, {session.user.name}.
                </p>
            </div>
        </section>
    );
}
