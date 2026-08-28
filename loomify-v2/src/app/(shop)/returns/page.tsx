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
                        "Contact us within 30 days of delivery to request a return for an eligible item.",
                },
                {
                    heading: "Condition",
                    content:
                        "Items should be unworn, unwashed, and returned with their original tags.",
                },
            ]}
        />
    );
}
