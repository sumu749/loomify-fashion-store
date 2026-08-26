import type { FooterLink, SocialLink } from "@/types/footer";
import {
    FaInstagram,
    FaFacebookF,
    FaLinkedinIn,
    FaXTwitter,
} from "react-icons/fa6";

export const shopLinks: FooterLink[] = [
    { name: "Men", path: "/products?category=men" },
    { name: "Women", path: "/products?category=women" },
    { name: "Accessories", path: "/products?category=accessories" },
    { name: "Footwear", path: "/products?category=footwear" },
];

export const companyLinks: FooterLink[] = [
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms & Conditions", path: "/terms" },
];

export const supportLinks: FooterLink[] = [
    { name: "FAQ", path: "/faq" },
    { name: "Shipping", path: "/shipping" },
    { name: "Returns", path: "/returns" },
    { name: "Help Center", path: "/help" },
];

export const socialLinks: SocialLink[] = [
    { name: "Instagram", icon: FaInstagram, url: "#" },
    { name: "Facebook", icon: FaFacebookF, url: "#" },
    { name: "X", icon: FaXTwitter, url: "#" },
    { name: "LinkedIn", icon: FaLinkedinIn, url: "#" },
];
