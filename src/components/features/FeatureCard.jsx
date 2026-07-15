const FeatureCard = ({ feature }) => {
    const { icon: Icon, title, description } = feature;

    return (
        <article className="group rounded-card border border-border bg-white p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 transition duration-300 group-hover:bg-accent">
                <Icon
                    size={30}
                    className="text-accent transition duration-300 group-hover:text-white"
                />
            </div>

            <h3 className="mt-6 text-xl font-semibold text-primary">{title}</h3>

            <p className="mt-3 leading-7 text-gray-600">{description}</p>
        </article>
    );
};

export default FeatureCard;
