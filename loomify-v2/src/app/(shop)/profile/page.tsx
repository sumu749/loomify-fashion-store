import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MapPin, UserRound } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import Button from "@/components/common/Button";
import Link from "next/link";

const ProfilePage = async () => {
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
    });

    return (
        <section className="bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        My Account
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                        Profile
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Manage your account information and saved addresses.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                    {/* Personal Information */}

                    <section className="h-fit rounded-card border border-border bg-white p-6 sm:p-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                                <UserRound size={19} className="text-primary" />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Account</p>

                                <h2 className="font-semibold text-primary">
                                    Personal Information
                                </h2>
                            </div>
                        </div>

                        <div className="mt-8 space-y-5">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400">
                                    Name
                                </p>

                                <p className="mt-1 font-medium text-primary">
                                    {session.user.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400">
                                    Email
                                </p>

                                <p className="mt-1 break-all font-medium text-primary">
                                    {session.user.email}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Saved Addresses */}

                    <section className="rounded-card border border-border bg-white p-6 sm:p-8">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                                        <MapPin
                                            size={19}
                                            className="text-primary"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Delivery
                                        </p>

                                        <h2 className="font-semibold text-primary">
                                            Saved Addresses
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <Button asChild size="sm">
                                <Link href="/profile/addresses/new">
                                    Add Address
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-8">
                            {addresses.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center">
                                    <MapPin
                                        size={28}
                                        className="mx-auto text-gray-300"
                                    />

                                    <p className="mt-3 font-medium text-primary">
                                        No saved addresses
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Add an address to make checkout faster.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {addresses.map((address) => (
                                        <div
                                            key={address.id}
                                            className="rounded-xl border border-border p-5"
                                        >
                                            <p className="font-semibold text-primary">
                                                {address.fullName}
                                            </p>

                                            <p className="mt-2 text-sm text-gray-600">
                                                {address.phone}
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                                {address.addressLine}
                                                <br />
                                                {address.city},{" "}
                                                {address.district}
                                                <br />
                                                {address.postalCode}
                                                <br />
                                                {address.country}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;
