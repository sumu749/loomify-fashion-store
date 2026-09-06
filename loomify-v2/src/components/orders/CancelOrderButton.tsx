"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";

interface CancelOrderButtonProps {
    orderId: string;
}

const CancelOrderButton = ({ orderId }: CancelOrderButtonProps) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?",
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Unable to cancel the order.");
                return;
            }

            toast.success("Order cancelled successfully.");

            router.refresh();
        } catch (error) {
            console.error("Cancel order failed:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
        >
            {loading ? "Cancelling..." : "Cancel Order"}
        </Button>
    );
};

export default CancelOrderButton;
