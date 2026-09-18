import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
    query: Record<string, string | undefined>;
}

const AdminPagination = ({
    currentPage,
    totalPages,
    query,
}: AdminPaginationProps) => {
    if (totalPages <= 1) {
        return null;
    }

    const createHref = (page: number) => {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value && key !== "page") {
                params.set(key, value);
            }
        });

        params.set("page", String(page));

        return `?${params.toString()}`;
    };

    return (
        <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-2 border-t border-border px-6 py-5"
        >
            <Link
                href={createHref(Math.max(1, currentPage - 1))}
                aria-label="Previous page"
                aria-disabled={currentPage === 1}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-primary transition hover:border-accent hover:text-accent ${
                    currentPage === 1 ? "pointer-events-none opacity-40" : ""
                }`}
            >
                <ChevronLeft size={18} />
            </Link>

            <span className="min-w-24 text-center text-sm text-gray-500">
                Page {currentPage} of {totalPages}
            </span>

            <Link
                href={createHref(Math.min(totalPages, currentPage + 1))}
                aria-label="Next page"
                aria-disabled={currentPage === totalPages}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-primary transition hover:border-accent hover:text-accent ${
                    currentPage === totalPages
                        ? "pointer-events-none opacity-40"
                        : ""
                }`}
            >
                <ChevronRight size={18} />
            </Link>
        </nav>
    );
};

export default AdminPagination;
