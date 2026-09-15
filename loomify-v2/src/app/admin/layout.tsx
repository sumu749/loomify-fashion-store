import { headers } from "next/headers";
import { redirect } from "next/navigation";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { auth } from "@/lib/auth";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
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
        <div className="min-h-screen w-full overflow-x-hidden bg-stone-50">
            <div className="flex min-h-screen w-full">
                <AdminSidebar />

                <div className="min-w-0 w-full flex-1">
                    <AdminHeader />

                    <main className="w-full p-4 sm:p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
