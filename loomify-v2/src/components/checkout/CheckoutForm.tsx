"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";

const CheckoutForm = () => {
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("Bangladesh");

    const [loading, setLoading] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!fullName.trim()) {
            toast.error("Please enter your full name.");
            return;
        }

        if (!phone.trim()) {
            toast.error("Please enter your phone number.");
            return;
        }

        if (!address.trim()) {
            toast.error("Please enter your shipping address.");
            return;
        }

        if (!city.trim()) {
            toast.error("Please enter your city.");
            return;
        }

        if (!postalCode.trim()) {
            toast.error("Please enter your postal code.");
            return;
        }

        setLoading(true);

        try {
            console.log({
                fullName,
                phone,
                address,
                city,
                postalCode,
                country,
            });

            toast.success("Shipping information saved.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]"
        >
            {/* Shipping Information */}

            <section className="rounded-card border border-border bg-white p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-primary">
                    Shipping Information
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="fullName"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Full Name
                        </label>

                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(event) =>
                                setFullName(event.target.value)
                            }
                            autoComplete="name"
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none transition focus:border-accent"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Phone Number
                        </label>

                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            autoComplete="tel"
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none transition focus:border-accent"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="address"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Address
                        </label>

                        <textarea
                            id="address"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            rows={4}
                            autoComplete="street-address"
                            className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-accent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="city"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            City
                        </label>

                        <input
                            id="city"
                            type="text"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            autoComplete="address-level2"
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none transition focus:border-accent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="postalCode"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Postal Code
                        </label>

                        <input
                            id="postalCode"
                            type="text"
                            value={postalCode}
                            onChange={(event) =>
                                setPostalCode(event.target.value)
                            }
                            autoComplete="postal-code"
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none transition focus:border-accent"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="country"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Country
                        </label>

                        <input
                            id="country"
                            type="text"
                            value={country}
                            onChange={(event) => setCountry(event.target.value)}
                            autoComplete="country-name"
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none transition focus:border-accent"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Continue"}
                    </Button>
                </div>
            </section>

            {/* Order Summary placeholder */}

            <aside className="h-fit rounded-card border border-border bg-white p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-primary">
                    Order Summary
                </h2>

                <p className="mt-4 text-sm text-gray-500">
                    Your cart summary will be connected here next.
                </p>
            </aside>
        </form>
    );
};

export default CheckoutForm;
