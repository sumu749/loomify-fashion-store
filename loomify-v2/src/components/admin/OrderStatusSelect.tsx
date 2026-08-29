"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

interface OrderStatusSelectProps {
    orderId: string;
    status: OrderStatus;
}

const statuses: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

const OrderStatusSelect = ({ orderId, status }: OrderStatusSelectProps) => {
    const router = useRouter();

    const [currentStatus, setCurrentStatus] = useState(status);

    const [loading, setLoading] = useState(false);

    const handleChange = async (nextStatus: OrderStatus) => {
        if (nextStatus === currentStatus) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: nextStatus,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to update order status.");
                return;
            }

            setCurrentStatus(nextStatus);

            toast.success("Order status updated successfully.");

            router.refresh();
        } catch (error) {
            console.error("Failed to update order status:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <label
                htmlFor="order-status"
                className="text-sm font-medium text-gray-600"
            >
                Status
            </label>

            <select
                id="order-status"
                value={currentStatus}
                disabled={loading}
                onChange={(event) =>
                    handleChange(event.target.value as OrderStatus)
                }
                className="h-11 rounded-xl border border-border bg-white px-4 text-sm font-medium outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
                {statuses.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default OrderStatusSelect;
