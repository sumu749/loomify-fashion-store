import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { notFound } from "next/navigation";

import ReviewDeleteButton from "@/components/admin/ReviewDeleteButton";
import ReviewStatusToggle from "@/components/admin/ReviewStatusToggle";
import Button from "@/components/common/Button";

import { prisma } from "@/lib/prisma";

interface AdminReviewDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

const AdminReviewDetailsPage = async ({
    params,
}: AdminReviewDetailsPageProps) => {
    const { id } = await params;

    const review = await prisma.review.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    createdAt: true,
                },
            },
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    if (!review) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-5xl">
            {/* Back */}

            <div className="mb-6">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/admin/reviews">
                        <ArrowLeft size={16} />
                        Back to Reviews
                    </Link>
                </Button>
            </div>

            {/* Header */}

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        Review Moderation
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Review Details
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Review submitted by {review.user.name}.
                    </p>
                </div>

                <span
                    className={`w-fit rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        review.approved
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                    }`}
                >
                    {review.approved ? "Approved" : "Pending"}
                </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                {/* Main Review */}

                <div className="space-y-6">
                    {/* Review Card */}

                    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                                    Customer Review
                                </p>

                                <div className="mt-3 flex items-center gap-1">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Star
                                            key={index}
                                            size={20}
                                            className={
                                                index < review.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            <span className="text-xs text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    },
                                )}
                            </span>
                        </div>

                        <div className="rounded-2xl bg-stone-50 p-5 sm:p-6">
                            {review.comment ? (
                                <p className="text-sm leading-7 text-gray-700 sm:text-base">
                                    “{review.comment}”
                                </p>
                            ) : (
                                <p className="text-sm italic text-gray-400">
                                    This review does not contain a written
                                    comment.
                                </p>
                            )}
                        </div>

                        <div className="mt-6 border-t border-border pt-6">
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                                Review ID
                            </p>

                            <p className="mt-1 break-all text-sm text-gray-600">
                                {review.id}
                            </p>
                        </div>
                    </section>

                    {/* Product */}

                    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                            Product
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-primary">
                            {review.product.name}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Product ID: {review.product.id}
                        </p>

                        <div className="mt-5">
                            <Button asChild variant="outline" size="sm">
                                <Link
                                    href={`/products/${review.product.slug}`}
                                    target="_blank"
                                >
                                    View Product
                                </Link>
                            </Button>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}

                <div className="space-y-6">
                    {/* Customer */}

                    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                            Customer
                        </p>

                        <div className="mt-5 flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-gray-600">
                                {review.user.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate font-semibold text-primary">
                                    {review.user.name}
                                </p>

                                <p className="mt-1 truncate text-xs text-gray-400">
                                    {review.user.email}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 border-t border-border pt-5">
                            <p className="text-xs text-gray-400">Customer ID</p>

                            <p className="mt-1 break-all text-sm text-gray-600">
                                {review.user.id}
                            </p>
                        </div>
                    </section>

                    {/* Moderation */}

                    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                            Moderation
                        </p>

                        <h2 className="mt-2 text-lg font-semibold text-primary">
                            Review Actions
                        </h2>

                        <div className="mt-5 space-y-3">
                            <ReviewStatusToggle
                                reviewId={review.id}
                                approved={review.approved}
                            />

                            <ReviewDeleteButton reviewId={review.id} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminReviewDetailsPage;
