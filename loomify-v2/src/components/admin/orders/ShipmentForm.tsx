"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";

interface ShipmentFormProps {
    orderId: string;
    shippingProvider: string | null;
    trackingNumber: string | null;
    trackingUrl: string | null;
}

const ShipmentForm = ({
    orderId,
    shippingProvider,
    trackingNumber,
    trackingUrl,
}: ShipmentFormProps) => {
    const router = useRouter();
    const [provider, setProvider] = useState(shippingProvider ?? "");
    const [number, setNumber] = useState(trackingNumber ?? "");
    const [url, setUrl] = useState(trackingUrl ?? "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shippingProvider: provider,
                    trackingNumber: number,
                    trackingUrl: url,
                }),
            });
            const result = await response.json();

            if (!response.ok) {
                toast.error(
                    result.message || "Unable to save shipment details.",
                );
                return;
            }

            toast.success("Shipment details saved.");
            router.refresh();
        } catch (error) {
            console.error("Failed to save shipment details:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
                <label
                    htmlFor="shipping-provider"
                    className="mb-2 block text-sm font-medium text-primary"
                >
                    Courier
                </label>
                <input
                    id="shipping-provider"
                    value={provider}
                    onChange={(event) => setProvider(event.target.value)}
                    maxLength={80}
                    required
                    className="h-11 w-full border border-border px-3 text-sm outline-none focus:border-accent"
                />
            </div>

            <div>
                <label
                    htmlFor="tracking-number"
                    className="mb-2 block text-sm font-medium text-primary"
                >
                    Tracking Number
                </label>
                <input
                    id="tracking-number"
                    value={number}
                    onChange={(event) => setNumber(event.target.value)}
                    maxLength={120}
                    required
                    className="h-11 w-full border border-border px-3 text-sm outline-none focus:border-accent"
                />
            </div>

            <div>
                <label
                    htmlFor="tracking-url"
                    className="mb-2 block text-sm font-medium text-primary"
                >
                    Tracking URL
                </label>
                <input
                    id="tracking-url"
                    type="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    maxLength={2048}
                    placeholder="https://"
                    className="h-11 w-full border border-border px-3 text-sm outline-none focus:border-accent"
                />
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Shipment Details"}
            </Button>
        </form>
    );
};

export default ShipmentForm;
