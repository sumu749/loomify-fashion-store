import Container from "@/components/common/Container";

interface InfoPageProps {
    title: string;
    description: string;
    sections: Array<{
        heading: string;
        content: string;
    }>;
}

const InfoPage = ({ title, description, sections }: InfoPageProps) => {
    return (
        <section className="py-16 sm:py-24">
            <Container>
                <div className="max-w-3xl">
                    <h1 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                        {title}
                    </h1>
                    <p className="mt-4 text-base leading-7 text-gray-600">
                        {description}
                    </p>

                    <div className="mt-12 space-y-8">
                        {sections.map((section) => (
                            <section key={section.heading}>
                                <h2 className="text-xl font-semibold text-primary">
                                    {section.heading}
                                </h2>
                                <p className="mt-3 leading-7 text-gray-600">
                                    {section.content}
                                </p>
                            </section>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default InfoPage;
