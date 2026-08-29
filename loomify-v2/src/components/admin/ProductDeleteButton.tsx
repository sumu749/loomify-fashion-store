"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProductDeleteButtonProps {
    productId: string;
    productName: string;
}

const ProductDeleteButton = ({
    productId,
    productName,
}: ProductDeleteButtonProps) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to delete product.");
                return;
            }

            toast.success("Product deleted successfully.");

            router.refresh();
        } catch (error) {
            console.error("Failed to delete product:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Delete ${productName}`}
        >
            <Trash2 size={16} />

            {loading ? "Deleting..." : "Delete"}
        </button>
    );
};

export default ProductDeleteButton;
