"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";
import { clearCart } from "@/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import formatCurrency from "@/utils/formatCurrency";

import { useRouter } from "next/navigation";

const CheckoutForm = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const cartItems = useAppSelector((state) => state.cart.items);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("Bangladesh");

    const [loading, setLoading] = useState(false);

    const subtotal = cartItems.reduce((total, item) => {
        const variant = item.variants.find(
            (itemVariant) => itemVariant.id === item.variantId,
        );

        const price = variant?.price ?? item.price;

        return total + price * item.quantity;
    }, 0);

    const shipping = subtotal > 100 ? 0 : 15;

    const total = subtotal + shipping;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (cartItems.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }

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

        if (!country.trim()) {
            toast.error("Please enter your country.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: cartItems.map((item) => ({
                        productId: item.id,
                        variantId: item.variantId,
                        quantity: item.quantity,
                    })),

                    shippingAddress: {
                        fullName: fullName.trim(),
                        phone: phone.trim(),
                        address: address.trim(),
                        city: city.trim(),
                        postalCode: postalCode.trim(),
                        country: country.trim(),
                    },
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Unable to process checkout.");
                return;
            }

            const orderId = result.data.orderId;

            dispatch(clearCart());

            toast.success("Order placed successfully!");

            router.push(`/order-success?orderId=${orderId}`);
        } catch (error) {
            console.error("Checkout request failed:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]"
        >
            {/* ================= Shipping Information ================= */}

            <section className="rounded-card border border-border bg-white p-6 sm:p-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        Delivery
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-primary sm:text-2xl">
                        Shipping Information
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Enter the address where you want your order delivered.
                    </p>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    {/* Full Name */}

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
                            placeholder="Enter your full name"
                            autoComplete="name"
                            className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none transition focus:border-accent"
                        />
                    </div>

                    {/* Phone */}

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
                            placeholder="01XXXXXXXXX"
                            autoComplete="tel"
                            className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none transition focus:border-accent"
                        />
                    </div>

                    {/* Address */}

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
                            placeholder="House, road, area, etc."
                            autoComplete="street-address"
                            className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none transition focus:border-accent"
                        />
                    </div>

                    {/* City */}

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
                            placeholder="Dhaka"
                            autoComplete="address-level2"
                            className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none transition focus:border-accent"
                        />
                    </div>

                    {/* Postal Code */}

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
                            placeholder="1207"
                            autoComplete="postal-code"
                            className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none transition focus:border-accent"
                        />
                    </div>

                    {/* Country */}

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
                            className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none transition focus:border-accent"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full sm:w-auto"
                        disabled={loading}
                    >
                        {loading ? "Placing Order..." : "Place Order"}
                    </Button>
                </div>
            </section>

            {/* ================= Order Summary ================= */}

            <aside className="h-fit rounded-card border border-border bg-white p-6 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Summary
                </p>

                <h2 className="mt-2 text-xl font-semibold text-primary sm:text-2xl">
                    Your Order
                </h2>

                <div className="mt-6 space-y-4">
                    {cartItems.map((item) => {
                        const variant = item.variants.find(
                            (itemVariant) => itemVariant.id === item.variantId,
                        );

                        const price = variant?.price ?? item.price;

                        return (
                            <div
                                key={`${item.id}-${item.variantId}`}
                                className="flex items-start justify-between gap-4"
                            >
                                <div className="min-w-0">
                                    <p className="font-medium text-primary">
                                        {item.name}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {variant?.size
                                            ? `Size: ${variant.size}`
                                            : ""}

                                        {variant?.color
                                            ? ` • Color: ${variant.color}`
                                            : ""}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Qty: {item.quantity}
                                    </p>
                                </div>

                                <span className="shrink-0 text-sm font-semibold text-primary">
                                    {formatCurrency(price * item.quantity)}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 border-t border-border pt-6">
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal</span>

                            <span className="font-medium text-primary">
                                {formatCurrency(subtotal)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Shipping</span>

                            <span className="font-medium text-primary">
                                {shipping === 0
                                    ? "Free"
                                    : formatCurrency(shipping)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-lg font-bold text-primary">
                            Total
                        </span>

                        <span className="text-xl font-bold text-primary">
                            {formatCurrency(total)}
                        </span>
                    </div>
                </div>

                <p className="mt-5 text-xs leading-5 text-gray-500">
                    Final pricing, stock availability, and order totals are
                    verified securely on the server.
                </p>
            </aside>
        </form>
    );
};

export default CheckoutForm;
