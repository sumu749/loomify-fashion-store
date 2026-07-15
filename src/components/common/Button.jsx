const Button = ({
    children,
    type = "button",
    variant = "primary",
    className = "",
    ...props
}) => {
    const baseStyle =
        "inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium transition-all duration-300";

    const variants = {
        primary: "bg-[#111827] text-white hover:bg-[#C8A96A]",

        secondary:
            "border border-gray-300 bg-white text-[#111827] hover:bg-gray-100",
    };
    return (
        <button
            type={type}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
