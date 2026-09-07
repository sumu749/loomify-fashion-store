import Link from "next/link";
import type { ReactNode } from "react";

interface AdminFilterSidebarProps {
    title?: string;
    clearHref?: string;
    children: ReactNode;
}

const AdminFilterSidebar = ({
    title = "Filters",
    clearHref,
    children,
}: AdminFilterSidebarProps) => {
    return (
        <aside className="h-fit rounded-2xl border border-border bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-base font-semibold text-primary">
                    {title}
                </h2>

                {clearHref && (
                    <Link
                        href={clearHref}
                        className="text-xs font-medium text-accent transition hover:underline"
                    >
                        Clear all
                    </Link>
                )}
            </div>

            <div className="space-y-6">{children}</div>
        </aside>
    );
};

export default AdminFilterSidebar;
