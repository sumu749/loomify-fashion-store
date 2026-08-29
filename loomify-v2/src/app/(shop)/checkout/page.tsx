import CheckoutForm from "@/components/checkout/CheckoutForm";

const CheckoutPage = () => {
    return (
        <section className="bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        Checkout
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                        Complete Your Order
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Enter your shipping information to continue.
                    </p>
                </div>

                <CheckoutForm />
            </div>
        </section>
    );
};

export default CheckoutPage;
