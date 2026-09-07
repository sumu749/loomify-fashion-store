import Button from "@/components/common/Button";
import type { ReactNode } from "react";

interface AdminFilterSidebarProps {
    title?: string;
    children: ReactNode;
}

const AdminFilterSidebar = ({
    title = "Filters",
    children,
}: AdminFilterSidebarProps) => {
    return (
        <aside className="h-fit rounded-2xl border border-border bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-base font-semibold text-primary">
                    {title}
                </h2>

                <Button
                    type="button"
                    className="text-xs font-medium text-accent transition hover:underline"
                >
                    Clear all
                </Button>
            </div>

            <div className="space-y-6">{children}</div>
        </aside>
    );
};

export default AdminFilterSidebar;
