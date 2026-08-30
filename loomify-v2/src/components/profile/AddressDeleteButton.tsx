"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface AddressDeleteButtonProps {
    addressId: string;
}

const AddressDeleteButton = ({ addressId }: AddressDeleteButtonProps) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this address?",
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/addresses/${addressId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to delete address.");
                return;
            }

            toast.success("Address deleted successfully.");

            router.refresh();
        } catch (error) {
            console.error("Address deletion failed:", error);

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
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Trash2 size={16} />

            {loading ? "Deleting..." : "Delete"}
        </button>
    );
};

export default AddressDeleteButton;
