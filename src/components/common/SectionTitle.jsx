const SectionTitle = ({
    title,
    subtitle,
    align = "center",
    className = "",
}) => {
    const alignment = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };
    return (
        <div className={`mb-12 ${alignment[align]} ${className}`}>
            {subtitle && (
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-accent">
                    {subtitle}
                </p>
            )}

            <h2 className="text-3xl font-bold text-primary md:text-4xl">
                {title}
            </h2>
        </div>
    );
};

export default SectionTitle;
