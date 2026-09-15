"use client";

import { AlertTriangle } from "lucide-react";
import Button from "@/components/common/Button";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
        >
            <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-7">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                        <AlertTriangle size={20} />
                    </div>

                    <div className="min-w-0">
                        <h2
                            id="confirm-dialog-title"
                            className="text-lg font-semibold text-primary"
                        >
                            {title}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                        className="w-full sm:w-auto"
                    >
                        {cancelLabel}
                    </Button>

                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="w-full sm:w-auto"
                    >
                        {loading ? "Please wait..." : confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
