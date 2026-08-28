import InfoPage from "@/components/common/InfoPage";

export default function AboutPage() {
    return (
        <InfoPage
            title="About Loomify"
            description="Loomify brings together timeless essentials and considered details for an effortless everyday wardrobe."
            sections={[
                {
                    heading: "Our approach",
                    content:
                        "We choose versatile silhouettes, dependable materials, and thoughtful finishing so every piece earns its place in your closet.",
                },
                {
                    heading: "Quality first",
                    content:
                        "Our collections are curated around comfort, durability, and easy personal style.",
                },
            ]}
        />
    );
}
