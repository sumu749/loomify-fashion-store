import InfoPage from "@/components/common/InfoPage";

export default function ReturnsPage() {
    return (
        <InfoPage
            title="Returns"
            description="We want you to feel confident in every Loomify purchase."
            sections={[
                {
                    heading: "Return window",
                    content:
                        "Submit a return or exchange request from your order details within 30 days after delivery. Only delivered orders are eligible.",
                },
                {
                    heading: "Condition",
                    content:
                        "Items should be unworn, unwashed, and returned with their original tags. Include the affected item, quantity, preferred resolution, and reason in your request.",
                },
                {
                    heading: "Review and resolution",
                    content:
                        "Our team will review your request and update its status in your order details. Refunds and exchanges are handled by our team after the returned item is received; submitting a request does not automatically issue a refund or replacement.",
                },
            ]}
        />
    );
}
