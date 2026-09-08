"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const ProductPagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: ProductPaginationProps) => {
    if (totalPages <= 1) {
        return null;
    }

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <nav
            aria-label="Product pagination"
            className="mt-10 flex items-center justify-center gap-2"
        >
            {/* Previous */}

            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-primary transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronLeft size={18} />
            </button>

            {/* Pages */}

            <div className="flex items-center gap-2">
                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-medium transition ${
                            page === currentPage
                                ? "bg-primary text-white"
                                : "border border-border bg-white text-gray-600 hover:border-accent hover:text-accent"
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next */}

            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-primary transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronRight size={18} />
            </button>
        </nav>
    );
};

export default ProductPagination;
