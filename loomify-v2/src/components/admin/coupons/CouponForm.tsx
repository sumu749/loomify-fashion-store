"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";

type DiscountType = "PERCENTAGE" | "FIXED";

const CouponForm = () => {
    const router = useRouter();

    const [code, setCode] = useState("");
    const [type, setType] = useState<DiscountType>("PERCENTAGE");
    const [value, setValue] = useState("");
    const [minOrderAmount, setMinOrderAmount] = useState("");
    const [maxDiscount, setMaxDiscount] = useState("");
    const [usageLimit, setUsageLimit] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [active, setActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedCode = code.trim().toUpperCase();
        const discountValue = Number(value);
        const minimumOrder = minOrderAmount ? Number(minOrderAmount) : null;
        const maximumDiscount = maxDiscount ? Number(maxDiscount) : null;
        const limit = usageLimit ? Number(usageLimit) : null;

        if (!normalizedCode) {
            toast.error("Coupon code is required");
            return;
        }

        if (!value || Number.isNaN(discountValue) || discountValue <= 0) {
            toast.error("Discount value must be greater than 0");
            return;
        }

        if (type === "PERCENTAGE" && discountValue > 100) {
            toast.error("Percentage discount cannot exceed 100%");
            return;
        }

        if (
            minimumOrder !== null &&
            (Number.isNaN(minimumOrder) || minimumOrder < 0)
        ) {
            toast.error("Minimum order amount is invalid");
            return;
        }

        if (
            type === "PERCENTAGE" &&
            maximumDiscount !== null &&
            (Number.isNaN(maximumDiscount) || maximumDiscount <= 0)
        ) {
            toast.error("Maximum discount must be greater than 0");
            return;
        }

        if (limit !== null && (!Number.isInteger(limit) || limit <= 0)) {
            toast.error("Usage limit must be a positive integer");
            return;
        }

        if (expiresAt && expiresAt < today) {
            toast.error("Expiry date cannot be in the past");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/admin/coupons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    code: normalizedCode,
                    type,
                    value: discountValue,
                    minOrderAmount: minimumOrder,
                    maxDiscount: type === "PERCENTAGE" ? maximumDiscount : null,
                    usageLimit: limit,
                    active,
                    expiresAt: expiresAt
                        ? new Date(`${expiresAt}T23:59:59`).toISOString()
                        : null,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                toast.error(result.message || "Failed to create coupon");
                return;
            }

            toast.success("Coupon created successfully");

            router.push("/admin/coupons");
            router.refresh();
        } catch (error) {
            console.error("Failed to create coupon:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Coupon Details */}

            <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8">
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                        Coupon Details
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-primary">
                        Basic Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Define the coupon code and discount type.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Code */}

                    <div className="md:col-span-2">
                        <label
                            htmlFor="coupon-code"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Coupon Code <span className="text-red-500">*</span>
                        </label>

                        <input
                            id="coupon-code"
                            name="code"
                            type="text"
                            value={code}
                            onChange={(event) =>
                                setCode(event.target.value.toUpperCase())
                            }
                            placeholder="e.g. SUMMER20"
                            maxLength={50}
                            required
                            autoComplete="off"
                            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm font-medium tracking-wide text-primary uppercase outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-accent focus:ring-1 focus:ring-accent/20"
                        />

                        <p className="mt-2 text-xs text-gray-400">
                            Customers will enter this code at checkout.
                        </p>
                    </div>

                    {/* Discount Type */}

                    <div>
                        <label
                            htmlFor="discount-type"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Discount Type{" "}
                            <span className="text-red-500">*</span>
                        </label>

                        <select
                            id="discount-type"
                            name="type"
                            value={type}
                            onChange={(event) =>
                                setType(event.target.value as DiscountType)
                            }
                            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/20"
                        >
                            <option value="PERCENTAGE">Percentage</option>

                            <option value="FIXED">Fixed Amount</option>
                        </select>
                    </div>

                    {/* Discount Value */}

                    <div>
                        <label
                            htmlFor="discount-value"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Discount Value{" "}
                            <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <input
                                id="discount-value"
                                name="value"
                                type="number"
                                min="0.01"
                                max={type === "PERCENTAGE" ? "100" : undefined}
                                step="0.01"
                                value={value}
                                onChange={(event) =>
                                    setValue(event.target.value)
                                }
                                placeholder={
                                    type === "PERCENTAGE" ? "20" : "500"
                                }
                                required
                                className="h-12 w-full rounded-xl border border-border bg-white px-4 pr-14 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-accent focus:ring-1 focus:ring-accent/20"
                            />

                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                                {type === "PERCENTAGE" ? "%" : "BDT"}
                            </span>
                        </div>

                        <p className="mt-2 text-xs text-gray-400">
                            {type === "PERCENTAGE"
                                ? "Enter a value between 1 and 100."
                                : "Enter the fixed discount amount."}
                        </p>
                    </div>
                </div>
            </section>

            {/* Order Rules */}

            <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8">
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                        Discount Rules
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-primary">
                        Order Conditions
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Set optional limits for how the coupon can be used.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Minimum Order */}

                    <div>
                        <label
                            htmlFor="min-order"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Minimum Order Amount
                        </label>

                        <div className="relative">
                            <input
                                id="min-order"
                                name="minOrderAmount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={minOrderAmount}
                                onChange={(event) =>
                                    setMinOrderAmount(event.target.value)
                                }
                                placeholder="1000"
                                className="h-12 w-full rounded-xl border border-border bg-white px-4 pr-14 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-accent focus:ring-1 focus:ring-accent/20"
                            />

                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                                BDT
                            </span>
                        </div>

                        <p className="mt-2 text-xs text-gray-400">
                            Leave empty if there is no minimum order.
                        </p>
                    </div>

                    {/* Maximum Discount */}

                    {type === "PERCENTAGE" && (
                        <div>
                            <label
                                htmlFor="max-discount"
                                className="mb-2 block text-sm font-medium text-primary"
                            >
                                Maximum Discount
                            </label>

                            <div className="relative">
                                <input
                                    id="max-discount"
                                    name="maxDiscount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={maxDiscount}
                                    onChange={(event) =>
                                        setMaxDiscount(event.target.value)
                                    }
                                    placeholder="500"
                                    className="h-12 w-full rounded-xl border border-border bg-white px-4 pr-14 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-accent focus:ring-1 focus:ring-accent/20"
                                />

                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                                    BDT
                                </span>
                            </div>

                            <p className="mt-2 text-xs text-gray-400">
                                Caps the discount for percentage coupons.
                            </p>
                        </div>
                    )}

                    {/* Usage Limit */}

                    <div>
                        <label
                            htmlFor="usage-limit"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Usage Limit
                        </label>

                        <input
                            id="usage-limit"
                            name="usageLimit"
                            type="number"
                            min="1"
                            step="1"
                            value={usageLimit}
                            onChange={(event) =>
                                setUsageLimit(event.target.value)
                            }
                            placeholder="100"
                            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-accent focus:ring-1 focus:ring-accent/20"
                        />

                        <p className="mt-2 text-xs text-gray-400">
                            Leave empty for unlimited usage.
                        </p>
                    </div>

                    {/* Expiry */}

                    <div>
                        <label
                            htmlFor="expires-at"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Expiry Date
                        </label>

                        <input
                            id="expires-at"
                            name="expiresAt"
                            type="date"
                            min={today}
                            value={expiresAt}
                            onChange={(event) =>
                                setExpiresAt(event.target.value)
                            }
                            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/20"
                        />

                        <p className="mt-2 text-xs text-gray-400">
                            Leave empty if the coupon never expires.
                        </p>
                    </div>
                </div>
            </section>

            {/* Status */}

            <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                            Availability
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-primary">
                            Coupon Status
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Control whether customers can use this coupon.
                        </p>
                    </div>

                    <label className="inline-flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={active}
                            onChange={(event) =>
                                setActive(event.target.checked)
                            }
                            className="peer sr-only"
                        />

                        <span className="relative h-6 w-11 shrink-0 rounded-full bg-gray-200 transition peer-checked:bg-primary">
                            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                        </span>

                        <span className="text-sm font-medium text-primary">
                            {active ? "Active" : "Inactive"}
                        </span>
                    </label>
                </div>
            </section>

            {/* Actions */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/coupons")}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                >
                    {isSubmitting ? "Creating..." : "Create Coupon"}
                </Button>
            </div>
        </form>
    );
};

export default CouponForm;
