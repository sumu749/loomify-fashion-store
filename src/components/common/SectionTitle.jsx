const SectionTitle = ({
    title,
    subtitle,
    description,
    align = "center",
    className = "",
    descriptionClassName = "",
}) => {
    const alignment = {
        left: "items-start text-left",
        center: "items-center text-center",
        right: "items-end text-right",
    };

    return (
        <div className={`mb-14 flex flex-col ${alignment[align]} ${className}`}>
            {subtitle && (
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
                    {subtitle}
                </p>
            )}

            <h2 className="mt-3 text-2xl font-bold text-primary sm:text-3xl md:text-4xl lg:text-5xl">
                {title}
            </h2>

            {/* Accent Line */}
            <div className="mt-5 h-1 w-20 rounded-full bg-accent"></div>

            {description && (
                <p
                    className={`mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:mt-6 sm:text-base sm:leading-8 ${descriptionClassName}`}
                >
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionTitle;
