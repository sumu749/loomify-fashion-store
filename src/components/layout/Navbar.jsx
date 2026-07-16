/* eslint-disable indent */
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Container from "../common/Container";
import { navItems } from "../../constants/navigation";
import useCart from "../../hooks/useCart";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Active NavLink Style
    const getNavLinkClass = ({ isActive }) =>
        `relative transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:rounded-full after:bg-accent after:transition-all after:duration-300 ${
            isActive
                ? "text-accent after:w-full"
                : "text-primary after:w-0 hover:text-accent hover:after:w-full"
        }`;

    // Reusable Navigation Links
    const navigationLinks = navItems.map((item) => (
        <li key={item.path}>
            <NavLink
                to={item.path}
                className={getNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
            >
                {item.name}
            </NavLink>
        </li>
    ));

    return (
        <header
            className={`
        fixed
        inset-x-0
        top-0
        z-50
        transition-all
        duration-300
        ${
            isScrolled
                ? "border-b border-border bg-white/80 backdrop-blur-xl shadow-sm"
                : "bg-transparent"
        }
    `}
        >
            <Container>
                <nav className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <NavLink
                        to="/"
                        className="text-3xl font-bold tracking-wide transition-transform duration-300 hover:scale-105"
                    >
                        <span className="text-accent">L</span>
                        <span className="text-primary">oomify</span>
                    </NavLink>

                    {/* Desktop Navigation */}
                    <ul className="hidden items-center gap-8 md:flex">
                        {navigationLinks}
                    </ul>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <button
                            className="rounded-full p-2 transition-all duration-300 hover:bg-accent hover:text-white"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>

                        {/* Cart */}
                        <Link to="/cart" className="relative flex items-center">
                            <ShoppingBag size={22} />

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
                                        className="
                absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white "
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="rounded-full p-2 transition hover:bg-gray-100 md:hidden"
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </nav>
                <div
                    className={`overflow-hidden transition-all duration-300 md:hidden ${
                        isMenuOpen
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <ul className="flex flex-col gap-4 py-6">
                        {navigationLinks}
                    </ul>
                </div>
            </Container>
        </header>
    );
};

export default Navbar;
