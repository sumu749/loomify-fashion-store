import { headers } from "next/headers";
import { redirect } from "next/navigation";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CheckoutPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const addresses = await prisma.address.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            fullName: true,
            phone: true,
            addressLine: true,
            city: true,
            district: true,
            postalCode: true,
            country: true,
        },
    });

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

                <CheckoutForm addresses={addresses} />
            </div>
        </section>
    );
};

export default CheckoutPage;
