"use client";

import Link from "next/link";
import { Menu, Store } from "lucide-react";

import { useState } from "react";

const AdminHeader = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-xl">
            <div className="flex h-20 items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        className="rounded-lg p-2 transition hover:bg-stone-100 lg:hidden"
                        aria-label="Toggle admin navigation"
                    >
                        <Menu size={22} />
                    </button>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                            Loomify Admin
                        </p>

                        <h1 className="text-lg font-semibold text-primary sm:text-xl">
                            Dashboard
                        </h1>
                    </div>
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-primary transition hover:border-accent hover:text-accent"
                >
                    <Store size={17} />
                    <span className="hidden sm:inline">Visit Store</span>
                </Link>
            </div>

            {isMobileMenuOpen && (
                <div className="border-t border-border bg-white px-4 py-4 lg:hidden">
                    <p className="text-sm text-gray-500">Admin navigation</p>

                    <p className="mt-1 text-xs text-gray-400">
                        Mobile sidebar navigation will be connected next.
                    </p>
                </div>
            )}
        </header>
    );
};

export default AdminHeader;
