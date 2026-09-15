/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ClipboardList,
    Heart,
    LayoutDashboard,
    LogIn,
    LogOut,
    Menu,
    ShoppingBag,
    UserRound,
    X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Container from "../common/Container";
import Button from "../common/Button";
import ConfirmDialog from "../common/ConfirmDialog";

import { navItems } from "@/constants/navigation";
import { authClient } from "@/lib/auth-client";
import { useAppSelector } from "@/store/hooks";

const Navbar = () => {
    const pathname = usePathname();

    const { data: session, isPending } = authClient.useSession();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const cartCount = useAppSelector((state) =>
        state.cart.items.reduce((total, item) => total + item.quantity, 0),
    );

    const wishlistCount = useAppSelector(
        (state) => state.wishlist.items.length,
    );

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 16);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const getNavLinkClass = (path: string) => {
        const isActive =
            path === "/"
                ? pathname === "/"
                : pathname === path || pathname.startsWith(`${path}/`);

        return `relative text-sm font-medium transition-colors duration-200 ${
            isActive ? "text-accent" : "text-primary hover:text-accent"
        }`;
    };

    const handleLogout = async () => {
        setLogoutLoading(true);

        try {
            const { error } = await authClient.signOut();

            if (error) {
                toast.error("Failed to logout.");
                return;
            }

            setShowLogoutConfirm(false);
            setIsMenuOpen(false);

            toast.success("Logged out successfully.");
        } catch (error) {
            console.error("Logout failed:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setLogoutLoading(false);
        }
    };

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? "border-b border-border bg-white/95 shadow-sm backdrop-blur-xl"
                        : "bg-white/90 backdrop-blur-md"
                }`}
            >
                <Container>
                    <nav className="flex h-16 items-center justify-between sm:h-18">
                        {/* Logo */}

                        <Link
                            href="/"
                            className="shrink-0 text-2xl font-bold tracking-wide sm:text-3xl"
                            aria-label="Loomify home"
                        >
                            <span className="text-accent">L</span>
                            <span className="text-primary">oomify</span>
                        </Link>

                        {/* Desktop Navigation */}

                        <div className="hidden items-center gap-8 lg:flex">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={getNavLinkClass(item.path)}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {session && (
                                <Link
                                    href="/orders"
                                    className={getNavLinkClass("/orders")}
                                >
                                    Orders
                                </Link>
                            )}
                        </div>

                        {/* Actions */}

                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Wishlist */}

                            <Link
                                href="/wishlist"
                                aria-label="Wishlist"
                                className="relative flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-stone-100 hover:text-accent"
                            >
                                <Heart size={20} />

                                {wishlistCount > 0 && (
                                    <span className="absolute right-0.5 top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">
                                        {wishlistCount > 99
                                            ? "99+"
                                            : wishlistCount}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}

                            <Link
                                href="/cart"
                                aria-label="Shopping cart"
                                className="relative flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-stone-100 hover:text-accent"
                            >
                                <ShoppingBag size={20} />

                                <AnimatePresence>
                                    {cartCount > 0 && (
                                        <motion.span
                                            key={cartCount}
                                            initial={{
                                                scale: 0.7,
                                                opacity: 0,
                                            }}
                                            animate={{
                                                scale: 1,
                                                opacity: 1,
                                            }}
                                            exit={{
                                                scale: 0.7,
                                                opacity: 0,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 450,
                                                damping: 18,
                                            }}
                                            className="absolute right-0.5 top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white"
                                        >
                                            {cartCount > 99 ? "99+" : cartCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>

                            {/* Desktop Auth */}

                            <div className="ml-1 hidden items-center gap-2 lg:flex">
                                {isPending ? (
                                    <div className="h-9 w-28 animate-pulse rounded-full bg-stone-100" />
                                ) : session ? (
                                    <>
                                        {session.user.role === "ADMIN" && (
                                            <Link
                                                href="/admin"
                                                className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-primary transition hover:border-accent hover:text-accent"
                                            >
                                                <LayoutDashboard size={16} />
                                                Admin
                                            </Link>
                                        )}

                                        <Link
                                            href="/profile"
                                            className="inline-flex h-10 max-w-36 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-primary transition hover:border-accent hover:text-accent"
                                        >
                                            <UserRound size={16} />

                                            <span className="truncate">
                                                {session.user.name}
                                            </span>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowLogoutConfirm(true)
                                            }
                                            className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-primary transition hover:border-red-200 hover:text-red-500"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-primary transition hover:border-accent hover:text-accent"
                                        >
                                            <LogIn size={16} />
                                            Login
                                        </Link>

                                        <Button asChild size="sm">
                                            <Link href="/register">
                                                Register
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Button */}

                            <button
                                type="button"
                                onClick={() =>
                                    setIsMenuOpen((previous) => !previous)
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-stone-100 hover:text-accent lg:hidden"
                                aria-label={
                                    isMenuOpen
                                        ? "Close navigation menu"
                                        : "Open navigation menu"
                                }
                                aria-expanded={isMenuOpen}
                            >
                                {isMenuOpen ? (
                                    <X size={22} />
                                ) : (
                                    <Menu size={22} />
                                )}
                            </button>
                        </div>
                    </nav>

                    {/* Mobile Menu */}

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    height: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    height: "auto",
                                }}
                                exit={{
                                    opacity: 0,
                                    height: 0,
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeOut",
                                }}
                                className="overflow-hidden lg:hidden"
                            >
                                <div className="border-t border-border py-4">
                                    {/* Main Navigation */}

                                    <div className="space-y-1">
                                        {navItems.map((item) => {
                                            const isActive =
                                                item.path === "/"
                                                    ? pathname === "/"
                                                    : pathname === item.path ||
                                                      pathname.startsWith(
                                                          `${item.path}/`,
                                                      );

                                            return (
                                                <Link
                                                    key={item.path}
                                                    href={item.path}
                                                    className={`flex min-h-12 items-center rounded-xl px-4 text-sm font-medium transition ${
                                                        isActive
                                                            ? "bg-stone-100 text-accent"
                                                            : "text-primary hover:bg-stone-50 hover:text-accent"
                                                    }`}
                                                >
                                                    {item.name}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    {/* Account Links */}

                                    {!isPending && session && (
                                        <div className="mt-3 border-t border-border pt-3">
                                            <p className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                                                Account
                                            </p>

                                            <div className="space-y-1">
                                                <Link
                                                    href="/orders"
                                                    className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium transition ${
                                                        pathname.startsWith(
                                                            "/orders",
                                                        )
                                                            ? "bg-stone-100 text-accent"
                                                            : "text-primary hover:bg-stone-50 hover:text-accent"
                                                    }`}
                                                >
                                                    <ClipboardList size={18} />
                                                    Orders
                                                </Link>

                                                <Link
                                                    href="/profile"
                                                    className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium transition ${
                                                        pathname.startsWith(
                                                            "/profile",
                                                        )
                                                            ? "bg-stone-100 text-accent"
                                                            : "text-primary hover:bg-stone-50 hover:text-accent"
                                                    }`}
                                                >
                                                    <UserRound size={18} />
                                                    <span className="truncate">
                                                        {session.user.name}
                                                    </span>
                                                </Link>

                                                {session.user.role ===
                                                    "ADMIN" && (
                                                    <Link
                                                        href="/admin"
                                                        className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium text-primary transition hover:bg-stone-50 hover:text-accent"
                                                    >
                                                        <LayoutDashboard
                                                            size={18}
                                                        />
                                                        Admin Dashboard
                                                    </Link>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowLogoutConfirm(
                                                            true,
                                                        )
                                                    }
                                                    className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                                                >
                                                    <LogOut size={18} />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Guest Actions */}

                                    {!isPending && !session && (
                                        <div className="mt-3 border-t border-border pt-3">
                                            <div className="grid grid-cols-2 gap-3 px-1">
                                                <Link
                                                    href="/login"
                                                    className="flex h-11 items-center justify-center rounded-xl border border-border text-sm font-medium text-primary transition hover:border-accent hover:text-accent"
                                                >
                                                    Login
                                                </Link>

                                                <Button
                                                    asChild
                                                    variant="primary"
                                                    size="md"
                                                    className="w-full bg-[#111827]! text-white! hover:bg-[#C8A96A]! hover:text-white!"
                                                >
                                                    <Link href="/register">
                                                        Register
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Container>
            </header>

            {/* Logout Confirmation */}

            <ConfirmDialog
                open={showLogoutConfirm}
                title="Log out of Loomify?"
                description="You will need to sign in again to access your account and orders."
                confirmLabel="Logout"
                cancelLabel="Stay Signed In"
                loading={logoutLoading}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutConfirm(false)}
            />
        </>
    );
};

export default Navbar;
