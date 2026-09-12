"use client";

import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { useState, type ReactNode } from "react";

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
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="flex w-full items-center justify-between rounded-2xl border border-border bg-white px-4 py-3.5 shadow-sm transition hover:border-accent"
                >
                    <span className="flex items-center gap-2.5 text-sm font-semibold text-primary">
                        <SlidersHorizontal size={17} />
                        {title}
                    </span>

                    <span className="text-xs font-medium text-gray-400">
                        Filter products
                    </span>
                </button>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/30"
                    />

                    {/* Drawer */}
                    <div className="absolute right-0 top-0 flex h-full w-[min(88%,380px)] flex-col bg-white shadow-2xl">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-border px-5 py-4">
                            <div>
                                <h2 className="text-base font-semibold text-primary">
                                    {title}
                                </h2>

                                <p className="mt-1 text-xs text-gray-400">
                                    Refine your product results
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-stone-100 hover:text-primary"
                                aria-label="Close filters"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto px-5 py-5">
                            <div className="space-y-6">{children}</div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="border-t border-border px-5 py-4">
                            <div className="flex items-center gap-3">
                                {clearHref && (
                                    <Link
                                        href={clearHref}
                                        onClick={() => setIsOpen(false)}
                                        className="flex-1 rounded-xl border border-border px-4 py-3 text-center text-sm font-medium text-gray-600 transition hover:border-primary hover:bg-stone-50 hover:text-primary"
                                    >
                                        Clear all
                                    </Link>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
                                >
                                    Apply filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden h-fit rounded-2xl border border-border bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:block">
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
        </>
    );
};

export default AdminFilterSidebar;
