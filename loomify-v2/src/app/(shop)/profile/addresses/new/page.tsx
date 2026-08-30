import AddressForm from "@/components/profile/AddressForm";

const NewAddressPage = () => {
    return (
        <section className="bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        My Account
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                        Add Address
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Save a delivery address for faster checkout.
                    </p>
                </div>

                <AddressForm />
            </div>
        </section>
    );
};

export default NewAddressPage;
