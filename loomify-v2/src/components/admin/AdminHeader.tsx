"use client";

import Link from "next/link";
import { Menu, Store, X } from "lucide-react";
import { useState } from "react";

import { adminNavItems } from "./AdminSidebar";

const AdminHeader = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-xl">
            <div className="flex h-20 items-center justify-between px-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        className="shrink-0 rounded-lg p-2 transition hover:bg-stone-100 lg:hidden"
                        aria-label={
                            isMobileMenuOpen
                                ? "Close admin navigation"
                                : "Open admin navigation"
                        }
                    >
                        {isMobileMenuOpen ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )}
                    </button>

                    <div className="min-w-0">
                        <p className="truncate text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                            Loomify Admin
                        </p>

                        <h1 className="text-lg font-semibold text-primary sm:text-xl">
                            Dashboard
                        </h1>
                    </div>
                </div>

                <Link
                    href="/"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-primary transition hover:border-accent hover:text-accent sm:px-4"
                >
                    <Store size={17} />
                    <span className="hidden sm:inline">Visit Store</span>
                </Link>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="border-t border-border bg-white px-4 py-4 lg:hidden">
                    <nav className="space-y-1">
                        {adminNavItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-stone-50 hover:text-primary"
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default AdminHeader;
