import { headers } from "next/headers";
import { redirect } from "next/navigation";

import ReturnRequestActions from "@/components/admin/returns/ReturnRequestActions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const AdminReturnsPage = async () => {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        redirect("/login");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/unauthorized");
    }

    const requests = await prisma.returnRequest.findMany({
        include: {
            user: { select: { name: true, email: true } },
            order: { select: { id: true } },
            orderItem: {
                select: {
                    productName: true,
                    size: true,
                    color: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Customer Care
                </p>
                <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
                    Returns & Exchanges
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Review item requests and update their handling status.
                </p>
            </div>

            {requests.length === 0 ? (
                <section className="border border-border bg-white px-6 py-16 text-center">
                    <h2 className="text-xl font-semibold text-primary">
                        No return requests
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Customer requests will appear here.
                    </p>
                </section>
            ) : (
                <div className="space-y-4">
                    {requests.map((returnRequest) => (
                        <section
                            key={`${returnRequest.id}-${returnRequest.status}`}
                            className="border border-border bg-white p-5 sm:p-6"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        {returnRequest.status} ·{" "}
                                        {returnRequest.requestedResolution}
                                    </p>
                                    <h2 className="mt-2 text-lg font-semibold text-primary">
                                        {returnRequest.orderItem.productName}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Size {returnRequest.orderItem.size} ·{" "}
                                        {returnRequest.orderItem.color} · Qty{" "}
                                        {returnRequest.quantity}
                                    </p>
                                </div>
                                <div className="text-sm sm:text-right">
                                    <p className="font-medium text-primary">
                                        {returnRequest.user.name}
                                    </p>
                                    <p className="text-gray-500">
                                        {returnRequest.user.email}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Order #
                                        {returnRequest.order.id
                                            .slice(-8)
                                            .toUpperCase()}{" "}
                                        ·{" "}
                                        {returnRequest.createdAt.toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                                {returnRequest.reason}
                            </p>

                            <ReturnRequestActions
                                requestId={returnRequest.id}
                                status={returnRequest.status}
                                adminNote={returnRequest.adminNote}
                            />
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminReturnsPage;
