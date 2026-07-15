import { NavLink } from "react-router-dom";
import { Menu, Search, ShoppingBag } from "lucide-react";

import Container from "../common/Container";
import { navItems } from "../../constants/navigation";

const Navbar = () => {
    // Active NavLink Style
    const getNavLinkClass = ({ isActive }) =>
        `transition-colors duration-300 ${
            isActive
                ? "text-accent font-semibold"
                : "text-primary hover:text-accent"
        }`;

    // Reusable Navigation Links
    const navigationLinks = navItems.map((item) => (
        <li key={item.path}>
            <NavLink to={item.path} className={getNavLinkClass}>
                {item.name}
            </NavLink>
        </li>
    ));

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
            <Container>
                <nav className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <NavLink
                        to="/"
                        className="text-3xl font-bold tracking-wide text-primary"
                    >
                        <span className="text-accent">L</span>oomify
                    </NavLink>

                    {/* Desktop Navigation */}
                    <ul className="hidden items-center gap-8 md:flex">
                        {navigationLinks}
                    </ul>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <button
                            className="rounded-full p-2 transition hover:bg-gray-100"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>

                        {/* Cart */}
                        <button
                            className="relative rounded-full p-2 transition hover:bg-gray-100"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingBag size={22} />

                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
                                0
                            </span>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            className="rounded-full p-2 transition hover:bg-gray-100 md:hidden"
                            aria-label="Open Menu"
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                </nav>
            </Container>
        </header>
    );
};

export default Navbar;
