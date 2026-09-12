/* eslint-disable indent */
"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Check, MapPin, ShieldCheck, Tag, Truck } from "lucide-react";

import Button from "@/components/common/Button";
import { clearCart } from "@/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import formatCurrency from "@/utils/formatCurrency";

interface SavedAddress {
    id: string;
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
}

interface CheckoutFormProps {
    addresses: SavedAddress[];
}

const CheckoutForm = ({ addresses }: CheckoutFormProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const cartItems = useAppSelector((state) => state.cart.items);

    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [district, setDistrict] = useState("");

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("Bangladesh");

    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [discount, setDiscount] = useState(0);
    const [couponLoading, setCouponLoading] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState<"COD">("COD");

    const subtotal = cartItems.reduce((total, item) => {
        const variant = item.variants.find(
            (itemVariant) => itemVariant.id === item.variantId,
        );

        const price = variant?.price ?? item.price;

        return total + price * item.quantity;
    }, 0);

    const shipping = subtotal > 100 ? 0 : 15;

    const total = Math.max(subtotal + shipping - discount, 0);

    const handleApplyCoupon = async () => {
        const normalizedCode = couponCode.trim().toUpperCase();

        if (!normalizedCode) {
            toast.error("Please enter a coupon code.");
            return;
        }

        if (subtotal <= 0) {
            toast.error("Your cart is empty.");
            return;
        }

        setCouponLoading(true);

        try {
            const response = await fetch("/api/coupons/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: normalizedCode,
                    subtotal,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setAppliedCoupon(null);
                setDiscount(0);

                toast.error(result.message || "Unable to apply coupon.");

                return;
            }

            setAppliedCoupon(result.data.code);
            setDiscount(Number(result.data.discount));

            toast.success("Coupon applied successfully.");
        } catch (error) {
            console.error("Coupon validation failed:", error);

            toast.error("Unable to validate coupon.");
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode("");
        setAppliedCoupon(null);
        setDiscount(0);

        toast.success("Coupon removed.");
    };

    const updateAddressField = <K extends keyof SavedAddress>(
        field: K,
        value: SavedAddress[K],
    ) => {
        setSelectedAddressId("");

        switch (field) {
            case "fullName":
                setFullName(value as string);
                break;

            case "phone":
                setPhone(value as string);
                break;

            case "addressLine":
                setAddress(value as string);
                break;

            case "city":
                setCity(value as string);
                break;

            case "district":
                setDistrict(value as string);
                break;

            case "postalCode":
                setPostalCode(value as string);
                break;

            case "country":
                setCountry(value as string);
                break;
        }
    };

    const clearAddressForm = () => {
        setSelectedAddressId("");
        setFullName("");
        setPhone("");
        setAddress("");
        setCity("");
        setDistrict("");
        setPostalCode("");
        setCountry("Bangladesh");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (loading) {
            return;
        }

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

        const normalizedPhone = phone.replace(/\s+/g, "");

        if (!/^01\d{9}$/.test(normalizedPhone)) {
            toast.error("Please enter a valid Bangladesh phone number.");
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

        if (!district.trim()) {
            toast.error("Please enter your district.");
            return;
        }

        if (!postalCode.trim()) {
            toast.error("Please enter your postal code.");
            return;
        }

        if (!/^\d{4}$/.test(postalCode.trim())) {
            toast.error("Please enter a valid 4-digit postal code.");
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
                        district: district.trim(),
                        postalCode: postalCode.trim(),
                        country: country.trim(),
                    },

                    paymentMethod,
                    couponCode: appliedCoupon || undefined,
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
            className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
        >
            {/* =========================================================
                LEFT COLUMN
            ========================================================= */}

            <div className="min-w-0 space-y-6">
                {/* ================= Saved Addresses ================= */}

                {addresses.length === 0 ? (
                    <section className="border border-dashed border-border bg-white p-5 sm:p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent/10 text-accent">
                                <MapPin size={20} />
                            </div>

                            <div>
                                <p className="font-semibold text-primary">
                                    No saved addresses yet
                                </p>

                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    Save an address to make future checkout
                                    faster.
                                </p>

                                <div className="mt-4">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href="/profile/addresses/new?returnTo=/checkout">
                                            Add a Saved Address
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="border border-border bg-white p-6 sm:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                                    Delivery
                                </p>

                                <h2 className="mt-2 text-xl font-semibold text-primary sm:text-2xl">
                                    Saved Address
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Choose an address or enter one manually.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={clearAddressForm}
                                className="text-left text-sm font-medium text-accent transition hover:text-primary sm:text-right"
                            >
                                Enter manually
                            </button>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {addresses.map((savedAddress) => {
                                const isSelected =
                                    selectedAddressId === savedAddress.id;

                                return (
                                    <button
                                        key={savedAddress.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedAddressId(
                                                savedAddress.id,
                                            );

                                            setFullName(savedAddress.fullName);

                                            setPhone(savedAddress.phone);

                                            setAddress(
                                                savedAddress.addressLine,
                                            );

                                            setCity(savedAddress.city);

                                            setDistrict(savedAddress.district);

                                            setPostalCode(
                                                savedAddress.postalCode,
                                            );

                                            setCountry(savedAddress.country);
                                        }}
                                        className={`relative border p-5 text-left transition ${
                                            isSelected
                                                ? "border-primary bg-stone-50"
                                                : "border-border bg-white hover:border-primary"
                                        }`}
                                    >
                                        {isSelected && (
                                            <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                                                <Check size={14} />
                                            </span>
                                        )}

                                        <p className="pr-8 font-semibold text-primary">
                                            {savedAddress.fullName}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600">
                                            {savedAddress.phone}
                                        </p>

                                        <p className="mt-3 text-sm leading-6 text-gray-500">
                                            {savedAddress.addressLine}
                                            <br />
                                            {savedAddress.city},{" "}
                                            {savedAddress.district}
                                            <br />
                                            {savedAddress.postalCode}
                                            <br />
                                            {savedAddress.country}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ================= Shipping Information ================= */}

                <section className="border border-border bg-white p-6 sm:p-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                            Delivery
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-primary sm:text-2xl">
                            Shipping Information
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Enter the address where you want your order
                            delivered.
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
                                    updateAddressField(
                                        "fullName",
                                        event.target.value,
                                    )
                                }
                                placeholder="Enter your full name"
                                autoComplete="name"
                                className="h-12 w-full border border-border px-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
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
                                inputMode="numeric"
                                value={phone}
                                onChange={(event) =>
                                    updateAddressField(
                                        "phone",
                                        event.target.value,
                                    )
                                }
                                placeholder="01XXXXXXXXX"
                                autoComplete="tel"
                                className="h-12 w-full border border-border px-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
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
                                onChange={(event) =>
                                    updateAddressField(
                                        "addressLine",
                                        event.target.value,
                                    )
                                }
                                rows={4}
                                placeholder="House, road, area, etc."
                                autoComplete="street-address"
                                className="w-full resize-none border border-border px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
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
                                onChange={(event) =>
                                    updateAddressField(
                                        "city",
                                        event.target.value,
                                    )
                                }
                                placeholder="Dhaka"
                                autoComplete="address-level2"
                                className="h-12 w-full border border-border px-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
                            />
                        </div>

                        {/* District */}

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
                                onChange={(event) =>
                                    updateAddressField(
                                        "district",
                                        event.target.value,
                                    )
                                }
                                placeholder="Dhaka"
                                className="h-12 w-full border border-border px-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
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
                                inputMode="numeric"
                                value={postalCode}
                                onChange={(event) =>
                                    updateAddressField(
                                        "postalCode",
                                        event.target.value,
                                    )
                                }
                                placeholder="1207"
                                autoComplete="postal-code"
                                className="h-12 w-full border border-border px-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
                            />
                        </div>

                        {/* Country */}

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
                                inputMode="text"
                                value={country}
                                onChange={(event) =>
                                    updateAddressField(
                                        "country",
                                        event.target.value,
                                    )
                                }
                                autoComplete="country-name"
                                className="h-12 w-full border border-border px-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
                            />
                        </div>
                    </div>

                    {/* ================= Payment ================= */}

                    <div className="mt-10 border-t border-border pt-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center bg-accent/10 text-accent">
                                <ShieldCheck size={20} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                    Payment
                                </p>

                                <h3 className="mt-1 text-lg font-semibold text-primary">
                                    Payment Method
                                </h3>
                            </div>
                        </div>

                        <label
                            className={`mt-5 flex cursor-pointer items-start gap-4 border p-5 transition ${
                                paymentMethod === "COD"
                                    ? "border-primary bg-stone-50"
                                    : "border-border hover:border-primary"
                            }`}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={() => setPaymentMethod("COD")}
                                className="mt-1 h-4 w-4 accent-black"
                            />

                            <div>
                                <p className="font-semibold text-primary">
                                    Cash on Delivery
                                </p>

                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    Pay in cash when your order is delivered.
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Place Order */}

                    <div className="mt-8 border-t border-border pt-6">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full sm:w-auto"
                            disabled={loading}
                        >
                            {loading ? "Placing Order..." : "Place Order"}
                        </Button>

                        <p className="mt-3 text-xs leading-5 text-gray-400">
                            By placing your order, your cart items, stock
                            availability, pricing, and coupon are securely
                            verified on the server.
                        </p>
                    </div>
                </section>
            </div>

            {/* =========================================================
                RIGHT COLUMN — ORDER SUMMARY
            ========================================================= */}

            <aside className="h-fit lg:sticky lg:top-24">
                <div className="border border-border bg-white p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center bg-accent/10 text-accent">
                            <Truck size={20} />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                Summary
                            </p>

                            <h2 className="mt-1 text-xl font-semibold text-primary">
                                Your Order
                            </h2>
                        </div>
                    </div>

                    {/* Items */}

                    <div className="mt-7 space-y-5">
                        {cartItems.map((item) => {
                            const variant = item.variants.find(
                                (itemVariant) =>
                                    itemVariant.id === item.variantId,
                            );

                            const price = variant?.price ?? item.price;

                            return (
                                <div
                                    key={`${item.id}-${item.variantId}`}
                                    className="flex items-start justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium leading-5 text-primary">
                                            {item.name}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            {variant?.size
                                                ? `Size: ${variant.size}`
                                                : ""}

                                            {variant?.color
                                                ? ` • Color: ${variant.color}`
                                                : ""}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
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

                    {/* Coupon */}

                    <div className="mt-7 border-t border-border pt-6">
                        <div className="flex items-center gap-2">
                            <Tag size={16} className="text-accent" />

                            <p className="text-sm font-semibold text-primary">
                                Have a coupon?
                            </p>
                        </div>

                        {!appliedCoupon ? (
                            <div className="mt-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(event) =>
                                            setCouponCode(
                                                event.target.value.toUpperCase(),
                                            )
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                handleApplyCoupon();
                                            }
                                        }}
                                        placeholder="Enter coupon code"
                                        disabled={couponLoading || loading}
                                        autoComplete="off"
                                        spellCheck={false}
                                        className="h-11 min-w-0 flex-1 border border-border px-3 text-sm uppercase outline-none transition placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/10 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-gray-400"
                                    />

                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleApplyCoupon}
                                        disabled={
                                            couponLoading ||
                                            loading ||
                                            !couponCode.trim()
                                        }
                                    >
                                        {couponLoading
                                            ? "Applying..."
                                            : "Apply"}
                                    </Button>
                                </div>

                                <p className="mt-2 text-xs leading-5 text-gray-400">
                                    Enter a valid coupon code to receive your
                                    discount.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-3 border border-accent/20 bg-accent/5 px-4 py-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                                                <Check size={14} />
                                            </div>

                                            <p className="truncate text-sm font-semibold uppercase text-primary">
                                                {appliedCoupon}
                                            </p>
                                        </div>

                                        <p className="mt-2 text-xs leading-5 text-accent">
                                            Coupon applied successfully.
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            You saved {formatCurrency(discount)}{" "}
                                            on this order.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleRemoveCoupon}
                                        disabled={loading}
                                        className="shrink-0 text-xs font-medium text-gray-500 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Totals */}

                    <div className="mt-7 border-t border-border pt-6">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>

                                <span className="font-medium text-primary">
                                    {formatCurrency(subtotal)}
                                </span>
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Discount
                                    </span>

                                    <span className="font-medium text-accent">
                                        -{formatCurrency(discount)}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span className="text-gray-500">Shipping</span>

                                <span className="font-medium text-primary">
                                    {shipping === 0
                                        ? "Free"
                                        : formatCurrency(shipping)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
                            <span className="text-lg font-semibold text-primary">
                                Total
                            </span>

                            <span className="text-2xl font-bold text-primary">
                                {formatCurrency(total)}
                            </span>
                        </div>
                    </div>

                    {/* Trust note */}

                    <div className="mt-6 border-t border-border pt-5">
                        <div className="flex items-start gap-3">
                            <ShieldCheck
                                size={17}
                                className="mt-0.5 shrink-0 text-accent"
                            />

                            <p className="text-xs leading-5 text-gray-400">
                                Final pricing, stock availability, and coupon
                                validity are verified securely on the server.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Small trust row */}

                <div className="mt-3 grid grid-cols-2 border border-border bg-stone-50">
                    <div className="border-r border-border px-4 py-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                            Secure
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                            Checkout
                        </p>
                    </div>

                    <div className="px-4 py-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                            COD
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                            Available
                        </p>
                    </div>
                </div>
            </aside>
        </form>
    );
};

export default CheckoutForm;
