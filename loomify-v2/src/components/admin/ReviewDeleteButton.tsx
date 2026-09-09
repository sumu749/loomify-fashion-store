"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";

interface ReviewDeleteButtonProps {
    reviewId: string;
}

const ReviewDeleteButton = ({ reviewId }: ReviewDeleteButtonProps) => {
    const router = useRouter();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this review? This action cannot be undone.",
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/reviews/${reviewId}`, {
                method: "DELETE",
                credentials: "include",
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                toast.error(result.message || "Failed to delete review.");
                return;
            }

            toast.success("Review deleted successfully.");

            router.push("/admin/reviews");
            router.refresh();
        } catch (error) {
            console.error("Failed to delete review:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="border-red-200 text-red-600 hover:border-red-300 hover:text-red-700"
        >
            <Trash2 size={16} />

            {isDeleting ? "Deleting..." : "Delete Review"}
        </Button>
    );
};

export default ReviewDeleteButton;
