import InfoPage from "@/components/common/InfoPage";

export default function HelpPage() {
    return (
        <InfoPage
            title="Help Center"
            description="Need a hand? We can help with products, orders, delivery, and returns."
            sections={[
                {
                    heading: "Start here",
                    content:
                        "Visit the FAQ, Shipping, and Returns pages for quick answers to common questions.",
                },
                {
                    heading: "Still need help?",
                    content:
                        "Email support@loomify.com and include the details of your request.",
                },
            ]}
        />
    );
}
