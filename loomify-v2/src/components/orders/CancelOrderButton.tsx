"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";

interface CancelOrderButtonProps {
    orderId: string;
}

const CancelOrderButton = ({ orderId }: CancelOrderButtonProps) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleCancel = async () => {
        setShowConfirm(false);
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
        <>
            <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirm(true)}
                disabled={loading}
            >
                {loading ? "Cancelling..." : "Cancel Order"}
            </Button>

            <ConfirmDialog
                open={showConfirm}
                title="Cancel this order?"
                description="Are you sure you want to cancel this order? This action will restore the reserved stock."
                confirmLabel="Cancel Order"
                cancelLabel="Keep Order"
                loading={loading}
                onConfirm={handleCancel}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
};

export default CancelOrderButton;
