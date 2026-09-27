"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";

type ReturnRequestStatus =
    | "REQUESTED"
    | "APPROVED"
    | "REJECTED"
    | "RECEIVED"
    | "COMPLETED";

interface ReturnRequestActionsProps {
    requestId: string;
    status: ReturnRequestStatus;
    adminNote: string | null;
}

const nextStatuses: Record<ReturnRequestStatus, ReturnRequestStatus[]> = {
    REQUESTED: ["APPROVED", "REJECTED"],
    APPROVED: ["RECEIVED"],
    REJECTED: [],
    RECEIVED: ["COMPLETED"],
    COMPLETED: [],
};

const ReturnRequestActions = ({
    requestId,
    status,
    adminNote,
}: ReturnRequestActionsProps) => {
    const router = useRouter();
    const [nextStatus, setNextStatus] = useState(status);
    const [note, setNote] = useState(adminNote ?? "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/admin/returns/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus, adminNote: note }),
            });
            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Unable to update this request.");
                return;
            }

            toast.success("Return request updated.");
            router.refresh();
        } catch (error) {
            console.error("Failed to update return request:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-5 border-t border-border pt-5"
        >
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div>
                    <label
                        htmlFor={`return-status-${requestId}`}
                        className="mb-2 block text-sm font-medium text-primary"
                    >
                        Update status
                    </label>
                    <select
                        id={`return-status-${requestId}`}
                        value={nextStatus}
                        onChange={(event) =>
                            setNextStatus(
                                event.target.value as ReturnRequestStatus,
                            )
                        }
                        className="h-11 w-full border border-border bg-white px-3 text-sm outline-none focus:border-accent"
                    >
                        <option value={status}>{status}</option>
                        {nextStatuses[status].map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Update"}
                </Button>
            </div>

            <div className="mt-4">
                <label
                    htmlFor={`admin-note-${requestId}`}
                    className="mb-2 block text-sm font-medium text-primary"
                >
                    Admin note
                </label>
                <textarea
                    id={`admin-note-${requestId}`}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    maxLength={1000}
                    rows={2}
                    className="w-full resize-y border border-border px-3 py-2 text-sm outline-none focus:border-accent"
                />
            </div>

            {status === "RECEIVED" && (
                <p className="mt-2 text-xs text-gray-500">
                    Mark complete only after the refund or exchange has been
                    handled.
                </p>
            )}
        </form>
    );
};

export default ReturnRequestActions;
