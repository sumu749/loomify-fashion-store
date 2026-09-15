/* eslint-disable indent */
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import ConfirmDialog from "@/components/common/ConfirmDialog";

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
    const [showConfirm, setShowConfirm] = useState(false);

    const isCurrentUser = userId === currentUserId;

    const nextRole = role === "ADMIN" ? "USER" : "ADMIN";

    const handleChangeRole = async () => {
        if (isCurrentUser) {
            toast.error("You cannot change your own role.");
            return;
        }

        setShowConfirm(false);
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
        <>
            <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className="text-sm font-medium text-accent transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading
                    ? "Updating..."
                    : role === "ADMIN"
                      ? "Make User"
                      : "Make Admin"}
            </button>

            <ConfirmDialog
                open={showConfirm}
                title={
                    nextRole === "ADMIN"
                        ? "Make this user an admin?"
                        : "Remove admin access?"
                }
                description={
                    nextRole === "ADMIN"
                        ? "This user will gain access to the Loomify admin panel and administrative features."
                        : "This user will lose admin access and return to a regular customer account."
                }
                confirmLabel={nextRole === "ADMIN" ? "Make Admin" : "Make User"}
                cancelLabel="Cancel"
                loading={loading}
                onConfirm={handleChangeRole}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
};

export default UserRoleToggle;
