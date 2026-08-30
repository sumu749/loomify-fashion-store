"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";

const AddressForm = () => {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [addressLine, setAddressLine] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("Bangladesh");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!fullName.trim()) {
            toast.error("Please enter your full name.");
            return;
        }

        if (!phone.trim()) {
            toast.error("Please enter your phone number.");
            return;
        }

        if (!addressLine.trim()) {
            toast.error("Please enter your address.");
            return;
        }

        if (!city.trim()) {
            toast.error("Please enter your city.");
            return;
        }

        if (!district.trim()) {
            toast.error("Please enter your district.");
            return;
        }

        if (!postalCode.trim()) {
            toast.error("Please enter your postal code.");
            return;
        }

        if (!country.trim()) {
            toast.error("Please enter your country.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/addresses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: fullName.trim(),
                    phone: phone.trim(),
                    addressLine: addressLine.trim(),
                    city: city.trim(),
                    district: district.trim(),
                    postalCode: postalCode.trim(),
                    country: country.trim(),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to save address.");
                return;
            }

            toast.success("Address saved successfully!");

            router.push("/profile");
            router.refresh();
        } catch (error) {
            console.error("Address creation failed:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-card border border-border bg-white p-6 sm:p-8"
        >
            <div className="grid gap-5 sm:grid-cols-2">
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
                        onChange={(event) => setFullName(event.target.value)}
                        autoComplete="name"
                        className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none transition focus:border-accent"
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
                        className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none transition focus:border-accent"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label
                        htmlFor="addressLine"
                        className="mb-2 block text-sm font-medium text-primary"
                    >
                        Address
                    </label>

                    <textarea
                        id="addressLine"
                        value={addressLine}
                        onChange={(event) => setAddressLine(event.target.value)}
                        rows={4}
                        autoComplete="street-address"
                        placeholder="House, road, area, etc."
                        className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none transition focus:border-accent"
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
                        className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none transition focus:border-accent"
                    />
                </div>

                <div>
                    <label
                        htmlFor="district"
                        className="mb-2 block text-sm font-medium text-primary"
                    >
                        District
                    </label>

                    <input
                        id="district"
                        type="text"
                        value={district}
                        onChange={(event) => setDistrict(event.target.value)}
                        className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none transition focus:border-accent"
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
                        onChange={(event) => setPostalCode(event.target.value)}
                        autoComplete="postal-code"
                        className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none transition focus:border-accent"
                    />
                </div>

                <div>
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
                        className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none transition focus:border-accent"
                    />
                </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/profile")}
                >
                    Cancel
                </Button>

                <Button type="submit" disabled={loading}>
                    {loading ? "Saving Address..." : "Save Address"}
                </Button>
            </div>
        </form>
    );
};

export default AddressForm;
