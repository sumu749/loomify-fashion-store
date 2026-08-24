import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    size?: "sm" | "md" | "lg";
    asChild?: boolean;
}

const Button = ({
    children,
    size = "md",
    className = "",
    asChild = false,
    ...props
}: ButtonProps) => {
    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-base",
    };

    const buttonClassName = `inline-flex items-center justify-center gap-2 rounded-xl bg-primary font-medium text-white transition-all duration-300 hover:bg-accent ${sizes[size]} ${className}`;

    if (asChild) {
        return <span className={buttonClassName}>{children}</span>;
    }

    return (
        <button {...props} className={buttonClassName}>
            {children}
        </button>
    );
};

export default Button;
