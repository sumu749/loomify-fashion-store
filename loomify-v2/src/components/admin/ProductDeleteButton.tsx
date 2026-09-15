"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import ConfirmDialog from "@/components/common/ConfirmDialog";

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
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setShowConfirm(false);
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
        <>
            <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`Delete ${productName}`}
            >
                <Trash2 size={16} />

                {loading ? "Deleting..." : "Delete"}
            </button>

            <ConfirmDialog
                open={showConfirm}
                title="Delete this product?"
                description={`Are you sure you want to delete "${productName}"? This action cannot be undone.`}
                confirmLabel="Delete Product"
                cancelLabel="Keep Product"
                loading={loading}
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
};

export default ProductDeleteButton;
