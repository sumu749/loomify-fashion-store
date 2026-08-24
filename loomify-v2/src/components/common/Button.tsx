import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary" | "outline" | "ghost";
}

const Button = ({
    children,
    size = "md",
    variant = "primary",
    className = "",
    type = "button",
    ...props
}: ButtonProps) => {
    const baseClasses =
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50";

    const sizeClasses = {
        sm: "h-10 px-5 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-base sm:h-14 sm:px-8",
    };

    const variantClasses = {
        primary: "bg-primary text-white hover:bg-accent",
        secondary: "bg-accent text-white hover:bg-primary",
        outline:
            "border border-primary bg-transparent text-primary hover:bg-primary hover:text-white",
        ghost: "bg-transparent text-primary hover:bg-gray-100",
    };

    return (
        <button
            type={type}
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
