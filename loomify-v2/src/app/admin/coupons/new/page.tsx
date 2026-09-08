import CouponForm from "@/components/admin/coupons/CouponForm";

const NewCouponPage = () => {
    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Store Management
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                    Create Coupon
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                    Create a discount coupon for your Loomify customers.
                </p>
            </div>

            <CouponForm />
        </div>
    );
};

export default NewCouponPage;
