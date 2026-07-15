import { Link } from "react-router-dom";

import Container from "../common/Container";

import {
    shopLinks,
    companyLinks,
    supportLinks,
    socialLinks,
} from "../../data/footerLinks";

const Footer = () => {
    return (
        <footer className="border-t border-border bg-stone-50">
            <Container>
                <div className="grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}

                    <div>
                        <Link
                            to="/"
                            className="text-3xl font-extrabold text-primary"
                        >
                            Loomify
                        </Link>

                        <p className="mt-5 leading-7 text-gray-600">
                            Timeless fashion crafted with premium quality,
                            designed to inspire confidence every day.
                        </p>

                        <div className="mt-8 flex gap-4">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon;

                                return (
                                    <a
                                        key={index}
                                        href={social.url}
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:border-accent hover:bg-accent hover:text-white"
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Shop */}

                    <FooterColumn title="Shop" links={shopLinks} />

                    {/* Company */}

                    <FooterColumn title="Company" links={companyLinks} />

                    {/* Support */}

                    <FooterColumn title="Support" links={supportLinks} />
                </div>

                {/* Bottom */}

                <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 text-sm text-gray-500 md:flex-row">
                    <p>
                        © {new Date().getFullYear()} Loomify. All Rights
                        Reserved.
                    </p>
                </div>
            </Container>
        </footer>
    );
};

const FooterColumn = ({ title, links }) => {
    return (
        <div>
            <h3 className="mb-5 text-lg font-semibold text-primary">{title}</h3>

            <ul className="space-y-3">
                {links.map((link) => (
                    <li key={link.name}>
                        <Link
                            to={link.path}
                            className="text-gray-600 transition hover:text-accent"
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Footer;
