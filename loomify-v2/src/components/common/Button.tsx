import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
}

interface NativeButtonProps
    extends
        BaseButtonProps,
        Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
    asChild?: false;
}

interface LinkButtonProps extends BaseButtonProps {
    asChild: true;
    href: string;
}

type ButtonProps = NativeButtonProps | LinkButtonProps;

const Button = (props: ButtonProps) => {
    const {
        children,
        variant = "primary",
        size = "md",
        className = "",
        asChild = false,
    } = props;

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-base",
    };

    const baseStyle =
        "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-all duration-300";

    const variants = {
        primary: "bg-[#111827] text-white hover:bg-[#C8A96A]",
        secondary:
            "border border-gray-300 bg-white text-[#111827] hover:bg-gray-100",
        outline:
            "border border-gray-900 bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white",
    };

    const classes = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;

    if (asChild) {
        const { href } = props as LinkButtonProps;

        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    const { type = "button", ...buttonProps } = props as NativeButtonProps;

    return (
        <button type={type} className={classes} {...buttonProps}>
            {children}
        </button>
    );
};

export default Button;
