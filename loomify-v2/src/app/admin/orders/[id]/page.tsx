/* eslint-disable indent */
import Link from "next/link";
import { CreditCard, MapPin, UserRound } from "lucide-react";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import formatCurrency from "@/utils/formatCurrency";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

interface AdminOrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
    SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    DELIVERED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const statusSteps = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
] as const;

const statusLabels = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

const getStatusStepIndex = (status: string) => {
    return statusSteps.indexOf(status as (typeof statusSteps)[number]);
};

const AdminOrderDetailsPage = async ({
    params,
}: AdminOrderDetailsPageProps) => {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    variant: {
                        select: {
                            id: true,
                            sku: true,
                            size: true,
                            color: true,
                        },
                    },
                },
            },
            payment: true,
        },
    });

    if (!order) {
        notFound();
    }

    const currentStepIndex = getStatusStepIndex(order.status);

    return (
        <div className="mx-auto max-w-7xl">
            {/* ================= Header ================= */}

            <div className="mb-8">
                <Link
                    href="/admin/orders"
                    className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-primary"
                >
                    <span className="mr-2 text-base">←</span>
                    Back to Orders
                </Link>

                <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                                Order Details
                            </p>

                            <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block" />

                            <p className="text-sm text-gray-500">
                                {order.createdAt.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>

                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                            #{order.id.slice(-8).toUpperCase()}
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Order ID:{" "}
                            <span className="font-medium text-gray-700">
                                {order.id}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <OrderStatusSelect
                            orderId={order.id}
                            status={order.status}
                        />

                        <span
                            className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-semibold ${
                                statusStyles[order.status]
                            }`}
                        >
                            <span className="mr-2 h-2 w-2 rounded-full bg-current" />
                            {statusLabels[order.status]}
                        </span>
                    </div>
                </div>
            </div>

            {/* ================= Order Progress ================= */}

            {order.status !== "CANCELLED" ? (
                <section className="mb-8 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                Order Progress
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Fulfillment Status
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500">
                            Current status:{" "}
                            <span className="font-semibold text-primary">
                                {statusLabels[order.status]}
                            </span>
                        </p>
                    </div>

                    <div className="mt-8 overflow-x-auto pb-2">
                        <div className="min-w-175">
                            <div className="relative">
                                {/* Progress Line */}
                                <div className="absolute left-[10%] right-[10%] top-4 h-px bg-gray-200" />

                                <div
                                    className="absolute left-[10%] top-4 h-px bg-primary transition-all duration-500"
                                    style={{
                                        width:
                                            currentStepIndex <= 0
                                                ? "0%"
                                                : `${(currentStepIndex / (statusSteps.length - 1)) * 80}%`,
                                    }}
                                />

                                <div className="relative grid grid-cols-5">
                                    {statusSteps.map((step, index) => {
                                        const isCompleted =
                                            currentStepIndex > index;

                                        const isCurrent =
                                            currentStepIndex === index;

                                        return (
                                            <div
                                                key={step}
                                                className="flex flex-col items-center text-center"
                                            >
                                                <div
                                                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-xs font-bold transition ${
                                                        isCompleted || isCurrent
                                                            ? "border-primary bg-primary text-white"
                                                            : "border-gray-200 text-gray-400"
                                                    }`}
                                                >
                                                    {isCompleted
                                                        ? "✓"
                                                        : index + 1}
                                                </div>

                                                <p
                                                    className={`mt-3 text-xs font-semibold sm:text-sm ${
                                                        isCurrent || isCompleted
                                                            ? "text-primary"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {statusLabels[step]}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="mb-8 rounded-2xl border border-red-100 bg-red-50/70 p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                                Order Status
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-red-800">
                                This order has been cancelled
                            </h2>

                            <p className="mt-1 text-sm text-red-700/80">
                                The order is no longer active and cannot
                                continue through fulfillment.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700">
                            Cancelled
                        </span>
                    </div>
                </section>
            )}

            {/* ================= Information Cards ================= */}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Customer */}

                <section className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-colors hover:border-gray-300">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                Customer
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Customer Information
                            </h2>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-primary">
                            <UserRound size={19} />
                        </div>
                    </div>

                    <div className="mt-6 space-y-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Name
                            </p>

                            <p className="mt-1 font-medium text-primary">
                                {order.user.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Email
                            </p>

                            <p className="mt-1 break-all text-sm font-medium text-gray-700">
                                {order.user.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Customer ID
                            </p>

                            <p className="mt-1 break-all text-xs text-gray-500">
                                {order.user.id}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Shipping */}

                <section className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-colors hover:border-gray-300">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                Delivery
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Shipping Address
                            </h2>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-primary">
                            <MapPin size={19} />
                        </div>
                    </div>

                    <div className="mt-6 space-y-3 text-sm leading-6 text-gray-600">
                        {Object.entries(
                            order.shippingAddress as Record<string, unknown>,
                        ).map(([key, value]) => (
                            <p key={key} className="break-words">
                                <span className="font-medium capitalize text-primary">
                                    {key.replaceAll("_", " ")}:
                                </span>{" "}
                                {String(value)}
                            </p>
                        ))}
                    </div>
                </section>

                {/* Payment */}

                <section className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-colors hover:border-gray-300">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                Payment
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Payment Information
                            </h2>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-primary">
                            <CreditCard size={19} />
                        </div>
                    </div>

                    {order.payment ? (
                        <div className="mt-6 space-y-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Provider
                                </p>

                                <p className="mt-1 font-medium text-primary">
                                    {order.payment.provider}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Status
                                </p>

                                <p className="mt-1">
                                    <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                        {order.payment.status}
                                    </span>
                                </p>
                            </div>

                            {order.payment.transactionId && (
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Transaction ID
                                    </p>

                                    <p className="mt-1 break-all text-xs font-medium text-gray-700">
                                        {order.payment.transactionId}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="mt-6 text-sm text-gray-500">
                            No payment record available.
                        </p>
                    )}
                </section>
            </div>

            {/* ================= Ordered Items ================= */}

            <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                            Products
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-primary">
                            Ordered Items
                        </h2>
                    </div>

                    <div className="w-fit rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                    </div>
                </div>

                {/* Desktop Items Table */}
                <div className="hidden overflow-x-auto sm:block">
                    <table className="w-full min-w-225">
                        <thead className="border-b border-border bg-stone-50/60">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Product
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Variant
                                </th>

                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Unit Price
                                </th>

                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Qty
                                </th>

                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {order.items.map((item) => (
                                <tr
                                    key={item.id}
                                    className="transition-colors hover:bg-stone-50/70"
                                >
                                    <td className="px-6 py-5">
                                        <p className="font-semibold text-primary">
                                            {item.productName}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Product ID: {item.productId}
                                        </p>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                {item.size}
                                            </span>

                                            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                {item.color}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs text-gray-400">
                                            SKU: {item.variantSku}
                                        </p>
                                    </td>

                                    <td className="px-6 py-5 text-right text-sm font-medium text-gray-700">
                                        {formatCurrency(
                                            Number(item.productPrice),
                                        )}
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        <span className="inline-flex min-w-9 items-center justify-center rounded-lg bg-stone-100 px-2.5 py-1.5 text-sm font-semibold text-primary">
                                            {item.quantity}
                                        </span>
                                    </td>

                                    <td className="px-6 py-5 text-right text-sm font-bold text-primary">
                                        {formatCurrency(
                                            Number(item.productPrice) *
                                                item.quantity,
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Items */}
                <div className="space-y-3 p-4 sm:hidden">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-xl border border-border p-4"
                        >
                            {/* Product */}
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-primary">
                                    {item.productName}
                                </p>

                                <p className="mt-1 truncate text-xs text-gray-400">
                                    Product ID: {item.productId}
                                </p>
                            </div>

                            {/* Variant */}
                            <div className="mt-4 border-t border-border pt-4">
                                <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                    Variant
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                        {item.size}
                                    </span>

                                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                        {item.color}
                                    </span>
                                </div>

                                <p className="mt-2 break-all text-xs text-gray-400">
                                    SKU: {item.variantSku}
                                </p>
                            </div>

                            {/* Pricing */}
                            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
                                <div>
                                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                        Unit Price
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-primary">
                                        {formatCurrency(
                                            Number(item.productPrice),
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                        Qty
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-primary">
                                        {item.quantity}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                        Total
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-primary">
                                        {formatCurrency(
                                            Number(item.productPrice) *
                                                item.quantity,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= Summary ================= */}

            <section className="mt-6 flex justify-end">
                <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                    <div className="border-b border-border bg-stone-50/60 px-6 py-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                            Billing
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-primary">
                            Order Summary
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Subtotal</span>

                                <span className="font-medium text-primary">
                                    {formatCurrency(Number(order.subtotal))}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Shipping</span>

                                <span className="font-medium text-primary">
                                    {Number(order.shippingCost) === 0
                                        ? "Free"
                                        : formatCurrency(
                                              Number(order.shippingCost),
                                          )}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Discount</span>

                                <span className="font-medium text-green-600">
                                    -{formatCurrency(Number(order.discount))}
                                </span>
                            </div>
                        </div>

                        <div className="my-5 border-t border-border" />

                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Total Amount
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    Final order value
                                </p>
                            </div>

                            <p className="text-2xl font-bold tracking-tight text-primary">
                                {formatCurrency(Number(order.total))}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminOrderDetailsPage;
