import InfoPage from "@/components/common/InfoPage";

export default function FaqPage() {
    return (
        <InfoPage
            title="Frequently Asked Questions"
            description="Find quick answers about shopping with Loomify."
            sections={[
                {
                    heading: "How do I track my order?",
                    content:
                        "We will send tracking details by email once your order ships.",
                },
                {
                    heading: "Can I change my order?",
                    content:
                        "Contact customer care as soon as possible. We can adjust an order before it enters fulfillment.",
                },
            ]}
        />
    );
}
