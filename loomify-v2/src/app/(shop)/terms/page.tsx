import InfoPage from "@/components/common/InfoPage";

export default function TermsPage() {
    return (
        <InfoPage
            title="Terms and Conditions"
            description="These terms explain the conditions for using Loomify and placing orders with us."
            sections={[
                {
                    heading: "Using Loomify",
                    content:
                        "Please provide accurate information and use the site lawfully and respectfully.",
                },
                {
                    heading: "Orders",
                    content:
                        "Orders are subject to product availability and confirmation of payment.",
                },
            ]}
        />
    );
}
