import InfoPage from "@/components/common/InfoPage";

export default function PrivacyPage() {
    return (
        <InfoPage
            title="Privacy Policy"
            description="We respect your privacy and use your information only to provide and improve Loomify services."
            sections={[
                {
                    heading: "Information we collect",
                    content:
                        "We collect the information needed to process orders, provide support, and keep your account secure.",
                },
                {
                    heading: "Your choices",
                    content:
                        "Contact us at support@loomify.com with questions about your personal information.",
                },
            ]}
        />
    );
}
