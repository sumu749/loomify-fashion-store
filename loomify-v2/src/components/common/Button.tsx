import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { cloneElement } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
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

interface AsChildButtonProps extends BaseButtonProps {
    asChild: true;
    children: ReactElement;
}

type ButtonProps = NativeButtonProps | AsChildButtonProps;

const Button = ({
    children,
    variant = "primary",
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

    const variants = {
        primary:
            "!bg-[#111827] !text-white hover:!bg-[#C8A96A] hover:!text-white",

        secondary:
            "!border !border-gray-300 !bg-white !text-[#111827] hover:!bg-gray-100",

        outline:
            "!border !border-gray-900 !bg-transparent !text-gray-900 hover:!bg-gray-900 hover:!text-white",

        ghost: "bg-transparent text-gray-600 hover:bg-stone-100 hover:text-primary",
    };

    const classes = [
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium",
        "transition-all duration-300",
        sizes[size],
        variants[variant],
        className,
    ]
        .filter(Boolean)
        .join(" ");

    if (asChild) {
        const child = children as ReactElement<{
            className?: string;
        }>;

        return cloneElement(child, {
            className: [classes, child.props.className]
                .filter(Boolean)
                .join(" "),
        });
    }

    const { type = "button", ...buttonProps } = props as NativeButtonProps;

    return (
        <button type={type} className={classes} {...buttonProps}>
            {children}
        </button>
    );
};

export default Button;
