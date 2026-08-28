import InfoPage from "@/components/common/InfoPage";

export default function ShippingPage() {
    return (
        <InfoPage
            title="Shipping"
            description="We prepare every order carefully and keep delivery details clear from checkout to arrival."
            sections={[
                {
                    heading: "Processing",
                    content:
                        "Orders are generally prepared within one to two business days.",
                },
                {
                    heading: "Delivery",
                    content:
                        "You will receive an email with delivery tracking when your order is on its way.",
                },
            ]}
        />
    );
}
