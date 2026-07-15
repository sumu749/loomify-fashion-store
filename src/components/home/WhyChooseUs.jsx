import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";

import FeatureCard from "../features/FeatureCard";
import whyChoose from "../../data/whyChoose";

const WhyChooseUs = () => {
    return (
        <section className="bg-stone-50 py-20">
            <Container>
                <SectionTitle
                    subtitle="Why Loomify"
                    title="Crafted for Modern Living"
                    description="Every product is thoughtfully designed to bring together timeless style, exceptional quality, and everyday comfort."
                />

                <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {whyChoose.map((feature) => (
                        <FeatureCard key={feature.id} feature={feature} />
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default WhyChooseUs;
