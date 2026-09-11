import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
}
