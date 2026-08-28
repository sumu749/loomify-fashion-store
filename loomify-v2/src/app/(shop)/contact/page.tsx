import InfoPage from "@/components/common/InfoPage";

export default function ContactPage() {
    return (
        <InfoPage
            title="Contact Us"
            description="Our team is here to help with orders, products, and anything else you need."
            sections={[
                {
                    heading: "Customer care",
                    content:
                        "Email support@loomify.com and we will respond within one business day.",
                },
                {
                    heading: "Order questions",
                    content:
                        "Please include your order number so we can help you quickly.",
                },
            ]}
        />
    );
}
