"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CategoryDeleteButtonProps {
    categoryId: string;
    categoryName: string;
}

const CategoryDeleteButton = ({
    categoryId,
    categoryName,
}: CategoryDeleteButtonProps) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${categoryName}"?`,
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `/api/admin/categories/${categoryId}`,
                {
                    method: "DELETE",
                },
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to delete category.");
                return;
            }

            toast.success("Category deleted successfully.");

            router.refresh();
        } catch (error) {
            console.error("Category deletion failed:", error);

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
            className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 transition hover:text-red-700 disabled:opacity-50"
        >
            <Trash2 size={16} />

            {loading ? "Deleting..." : "Delete"}
        </button>
    );
};

export default CategoryDeleteButton;
