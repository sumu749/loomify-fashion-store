/* eslint-disable indent */
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UserRoleToggleProps {
    userId: string;
    role: "USER" | "ADMIN";
    currentUserId: string;
}

const UserRoleToggle = ({
    userId,
    role,
    currentUserId,
}: UserRoleToggleProps) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const isCurrentUser = userId === currentUserId;

    const nextRole = role === "ADMIN" ? "USER" : "ADMIN";

    const handleChangeRole = async () => {
        if (isCurrentUser) {
            toast.error("You cannot change your own role.");
            return;
        }

        const confirmed = window.confirm(
            `Change this user's role from ${role} to ${nextRole}?`,
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    role: nextRole,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to update role.");
                return;
            }

            toast.success(
                nextRole === "ADMIN"
                    ? "User promoted to admin."
                    : "User changed to regular user.",
            );

            router.refresh();
        } catch (error) {
            console.error("Failed to change user role:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isCurrentUser) {
        return <span className="text-sm text-gray-400">Current account</span>;
    }

    return (
        <button
            type="button"
            onClick={handleChangeRole}
            disabled={loading}
            className="text-sm font-medium text-accent transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
            {loading
                ? "Updating..."
                : role === "ADMIN"
                  ? "Make User"
                  : "Make Admin"}
        </button>
    );
};

export default UserRoleToggle;
