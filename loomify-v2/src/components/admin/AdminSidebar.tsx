"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Boxes,
    ClipboardList,
    FolderKanban,
    LayoutDashboard,
    MessageSquare,
    TicketPercent,
    Users,
} from "lucide-react";
import Button from "../common/Button";

const adminNavItems = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        name: "Products",
        href: "/admin/products",
        icon: Boxes,
    },
    {
        name: "Categories",
        href: "/admin/categories",
        icon: FolderKanban,
    },
    {
        name: "Orders",
        href: "/admin/orders",
        icon: ClipboardList,
    },
    {
        name: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        name: "Coupons",
        href: "/admin/coupons",
        icon: TicketPercent,
    },
    {
        name: "Reviews",
        href: "/admin/reviews",
        icon: MessageSquare,
    },
];

const AdminSidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 shrink-0 border-r border-border bg-white lg:block">
            <div className="sticky top-0 flex h-screen flex-col">
                {/* Logo */}
                <div className="flex h-20 items-center border-b border-border px-6">
                    <Link
                        href="/admin"
                        className="text-2xl font-bold tracking-wide"
                    >
                        <span className="text-accent">L</span>
                        <span className="text-primary">oomify</span>

                        <span className="ml-2 text-xs font-medium uppercase tracking-widest text-gray-400">
                            Admin
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {adminNavItems.map((item) => {
                        const Icon = item.icon;

                        const isActive =
                            item.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(item.href);

                        return (
                            <Button
                                key={item.href}
                                asChild
                                variant={isActive ? "primary" : "ghost"}
                                size="sm"
                                className="w-full justify-start"
                            >
                                <Link href={item.href}>
                                    <Icon size={19} />
                                    <span>{item.name}</span>
                                </Link>
                            </Button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default AdminSidebar;
