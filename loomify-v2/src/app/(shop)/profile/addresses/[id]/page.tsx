import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import AddressForm from "@/components/profile/AddressForm";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface EditAddressPageProps {
    params: Promise<{
        id: string;
    }>;
}

const EditAddressPage = async ({ params }: EditAddressPageProps) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const { id } = await params;

    const address = await prisma.address.findFirst({
        where: {
            id,
            userId: session.user.id,
        },
    });

    if (!address) {
        notFound();
    }

    return (
        <section className="bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        My Account
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                        Edit Address
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Update your saved delivery address.
                    </p>
                </div>

                <AddressForm address={address} />
            </div>
        </section>
    );
};

export default EditAddressPage;
