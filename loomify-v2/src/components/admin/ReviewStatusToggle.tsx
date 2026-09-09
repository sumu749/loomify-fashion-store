"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";

interface ReviewStatusToggleProps {
    reviewId: string;
    approved: boolean;
}

const ReviewStatusToggle = ({
    reviewId,
    approved,
}: ReviewStatusToggleProps) => {
    const router = useRouter();

    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (nextApproved: boolean) => {
        setIsUpdating(true);

        try {
            const response = await fetch(`/api/admin/reviews/${reviewId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    approved: nextApproved,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                toast.error(
                    result.message || "Failed to update review status.",
                );
                return;
            }

            toast.success(
                nextApproved
                    ? "Review approved successfully."
                    : "Review rejected successfully.",
            );

            router.refresh();
        } catch (error) {
            console.error("Failed to update review status:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            {approved ? (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(false)}
                    disabled={isUpdating}
                >
                    <X size={16} />
                    {isUpdating ? "Updating..." : "Reject"}
                </Button>
            ) : (
                <Button
                    type="button"
                    size="sm"
                    onClick={() => handleStatusChange(true)}
                    disabled={isUpdating}
                >
                    <Check size={16} />
                    {isUpdating ? "Updating..." : "Approve"}
                </Button>
            )}
        </div>
    );
};

export default ReviewStatusToggle;
