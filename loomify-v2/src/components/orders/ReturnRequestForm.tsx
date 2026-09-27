"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";

interface ReturnRequestFormProps {
    orderId: string;
    orderItemId: string;
    maxQuantity: number;
}

const ReturnRequestForm = ({
    orderId,
    orderItemId,
    maxQuantity,
}: ReturnRequestFormProps) => {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [resolution, setResolution] = useState<"REFUND" | "EXCHANGE">(
        "REFUND",
    );
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/orders/${orderId}/returns`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderItemId,
                    quantity,
                    reason,
                    resolution,
                }),
            });
            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Unable to submit your request.");
                return;
            }

            toast.success("Return or exchange request submitted.");
            setReason("");
            router.refresh();
        } catch (error) {
            console.error("Failed to submit return request:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-5 border-t border-border pt-5"
        >
            <h3 className="font-semibold text-primary">
                Request a return or exchange
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor={`resolution-${orderItemId}`}
                        className="mb-2 block text-sm font-medium text-primary"
                    >
                        Preferred resolution
                    </label>
                    <select
                        id={`resolution-${orderItemId}`}
                        value={resolution}
                        onChange={(event) =>
                            setResolution(
                                event.target.value as "REFUND" | "EXCHANGE",
                            )
                        }
                        className="h-11 w-full border border-border bg-white px-3 text-sm outline-none focus:border-accent"
                    >
                        <option value="REFUND">Refund</option>
                        <option value="EXCHANGE">Exchange</option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor={`quantity-${orderItemId}`}
                        className="mb-2 block text-sm font-medium text-primary"
                    >
                        Quantity
                    </label>
                    <input
                        id={`quantity-${orderItemId}`}
                        type="number"
                        min={1}
                        max={maxQuantity}
                        value={quantity}
                        onChange={(event) =>
                            setQuantity(Number(event.target.value))
                        }
                        required
                        className="h-11 w-full border border-border px-3 text-sm outline-none focus:border-accent"
                    />
                </div>
            </div>

            <div className="mt-4">
                <label
                    htmlFor={`reason-${orderItemId}`}
                    className="mb-2 block text-sm font-medium text-primary"
                >
                    Reason
                </label>
                <textarea
                    id={`reason-${orderItemId}`}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    maxLength={1000}
                    rows={3}
                    required
                    className="w-full resize-y border border-border px-3 py-2 text-sm outline-none focus:border-accent"
                />
            </div>

            <Button type="submit" disabled={loading} className="mt-4">
                {loading ? "Submitting..." : "Submit Request"}
            </Button>
        </form>
    );
};

export default ReturnRequestForm;
