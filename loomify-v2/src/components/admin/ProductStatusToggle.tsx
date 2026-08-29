"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface ProductStatusToggleProps {
    productId: string;
    published: boolean;
}

const ProductStatusToggle = ({
    productId,
    published,
}: ProductStatusToggleProps) => {
    const [isPublished, setIsPublished] = useState(published);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);

        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    published: !isPublished,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(
                    result.message || "Failed to update product status.",
                );
                return;
            }

            setIsPublished(!isPublished);

            toast.success(
                !isPublished
                    ? "Product published successfully."
                    : "Product unpublished successfully.",
            );
        } catch (error) {
            console.error("Failed to update product status:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={loading}
            className={`inline-flex min-w-24 items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isPublished
                    ? "bg-green-50 text-green-700 hover:bg-green-100"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
            {loading ? "Updating..." : isPublished ? "Published" : "Draft"}
        </button>
    );
};

export default ProductStatusToggle;
