"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    Search,
    ShoppingBag,
    Heart,
    LogIn,
    LogOut,
    UserRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import Container from "../common/Container";
import { navItems } from "@/constants/navigation";
import { useAppSelector } from "@/store/hooks";

import { authClient } from "@/lib/auth-client";

import toast from "react-hot-toast";
import Button from "../common/Button";

const Navbar = () => {
    const pathname = usePathname();

    const { data: session, isPending } = authClient.useSession();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const handleLogout = async () => {
        const { error } = await authClient.signOut();

        if (error) {
            toast.error("Failed to logout.");
            return;
        }

        toast.success("Logged out successfully.");
    };

    const cartCount = useAppSelector((state) =>
        state.cart.items.reduce((total, item) => total + item.quantity, 0),
    );
    const wishlistCount = useAppSelector(
        (state) => state.wishlist.items.length,
    );

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getNavLinkClass = (path: string) => {
        const isActive =
            path === "/"
                ? pathname === "/"
                : pathname === path || pathname.startsWith(`${path}/`);

        return `relative transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:rounded-full after:bg-accent after:transition-all after:duration-300 ${
            isActive
                ? "text-accent after:w-full"
                : "text-primary after:w-0 hover:text-accent hover:after:w-full"
        }`;
    };

    const handleNavigation = () => {
        setIsMenuOpen(false);
    };

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "border-b border-border bg-white/80 shadow-sm backdrop-blur-xl"
                    : "bg-transparent"
            }`}
        >
            <Container>
                <nav
                    className={`flex items-center justify-between transition-all duration-300 ${
                        isScrolled ? "h-16" : "h-16 sm:h-20"
                    }`}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        onClick={handleNavigation}
                        className="text-2xl font-bold tracking-wide transition-transform duration-300 hover:scale-105 hover:tracking-wider sm:text-3xl"
                    >
                        <span className="text-accent">L</span>
                        <span className="text-primary">oomify</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="hidden items-center gap-8 md:flex lg:gap-12">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={getNavLinkClass(item.path)}
                                    onClick={handleNavigation}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Search */}
                        <button
                            type="button"
                            className="rounded-full p-2 transition-all duration-300 hover:scale-110 hover:bg-accent hover:text-white"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            aria-label="Wishlist"
                            className="relative flex items-center transition hover:text-accent"
                        >
                            <Heart size={22} />

                            {wishlistCount > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            aria-label="Shopping cart"
                            className="relative flex items-center"
                        >
                            <ShoppingBag
                                size={22}
                                className="transition-transform duration-300 hover:scale-110"
                            />

                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        key={cartCount}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 18,
                                        }}
                                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        {/* Auth Actions */}
                        <div className="hidden items-center gap-3 md:flex">
                            {isPending ? (
                                <div className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />
                            ) : session ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-primary transition hover:border-accent hover:text-accent"
                                    >
                                        <UserRound size={17} />
                                        <span className="max-w-24 truncate">
                                            {session.user.name}
                                        </span>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-primary transition hover:border-red-300 hover:text-red-500"
                                    >
                                        <LogOut size={17} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-primary transition hover:border-accent hover:text-accent"
                                    >
                                        <LogIn size={17} />
                                        Login
                                    </Link>

                                    <Button asChild size="sm">
                                        <Link href="/register">Register</Link>
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu */}
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            className="rounded-full p-2 transition hover:bg-gray-100 md:hidden"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Navigation */}
                <div
                    className={`overflow-hidden transition-all duration-300 md:hidden ${
                        isMenuOpen
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <ul className="flex flex-col gap-4 py-6">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={getNavLinkClass(item.path)}
                                    onClick={handleNavigation}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}

                        {/* Mobile Auth */}
                        <li className="border-t border-border pt-4">
                            {isPending ? (
                                <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
                            ) : session ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                        <UserRound size={17} />
                                        <span>{session.user.name}</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={async () => {
                                            await handleLogout();
                                            handleNavigation();
                                        }}
                                        className="flex items-center gap-2 text-left text-sm font-medium text-red-500"
                                    >
                                        <LogOut size={17} />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/login"
                                        onClick={handleNavigation}
                                        className="flex items-center gap-2 text-sm font-medium text-primary transition hover:text-accent"
                                    >
                                        <LogIn size={17} />
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        onClick={handleNavigation}
                                        className="flex items-center gap-2 text-sm font-medium text-primary transition hover:text-accent"
                                    >
                                        <UserRound size={17} />
                                        Register
                                    </Link>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </Container>
        </header>
    );
};

export default Navbar;
