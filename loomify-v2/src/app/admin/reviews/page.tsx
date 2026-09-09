/* eslint-disable indent */
import Link from "next/link";
import { MessageSquareText, Star, ThumbsUp, Clock3 } from "lucide-react";

import AdminFilterSidebar from "@/components/admin/filters/AdminFilterSidebar";
import ReviewFilters from "@/components/admin/reviews/ReviewFilters";
import Button from "@/components/common/Button";

import { prisma } from "@/lib/prisma";

interface AdminReviewsPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
        rating?: string;
        sort?: string;
    }>;
}

const AdminReviewsPage = async ({ searchParams }: AdminReviewsPageProps) => {
    const params = await searchParams;

    const search = params.search?.trim() ?? "";
    const status = params.status ?? "all";
    const rating = params.rating ?? "all";
    const sort = params.sort ?? "newest";

    const where = {
        ...(search
            ? {
                  OR: [
                      {
                          comment: {
                              contains: search,
                              mode: "insensitive" as const,
                          },
                      },
                      {
                          user: {
                              name: {
                                  contains: search,
                                  mode: "insensitive" as const,
                              },
                          },
                      },
                      {
                          user: {
                              email: {
                                  contains: search,
                                  mode: "insensitive" as const,
                              },
                          },
                      },
                      {
                          product: {
                              name: {
                                  contains: search,
                                  mode: "insensitive" as const,
                              },
                          },
                      },
                  ],
              }
            : {}),

        ...(status === "approved"
            ? { approved: true }
            : status === "pending"
              ? { approved: false }
              : {}),

        ...(["1", "2", "3", "4", "5"].includes(rating)
            ? { rating: Number(rating) }
            : {}),
    };

    const orderBy =
        sort === "oldest"
            ? { createdAt: "asc" as const }
            : sort === "highest"
              ? { rating: "desc" as const }
              : sort === "lowest"
                ? { rating: "asc" as const }
                : { createdAt: "desc" as const };

    const reviews = await prisma.review.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
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
        orderBy,
    });

    /*
     * Stats are calculated from the current filtered result set,
     * matching the existing admin list-page pattern.
     */

    const totalReviews = reviews.length;

    const approvedReviews = reviews.filter((review) => review.approved).length;

    const pendingReviews = reviews.filter((review) => !review.approved).length;

    const averageRating =
        totalReviews > 0
            ? reviews.reduce((total, review) => total + review.rating, 0) /
              totalReviews
            : 0;

    return (
        <div className="mx-auto max-w-7xl">
            {/* ================= Header ================= */}

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        Store Management
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Reviews
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                        Moderate customer feedback, manage approvals, and
                        monitor product ratings.
                    </p>
                </div>
            </div>

            {/* ================= Overview ================= */}

            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                                Reviews
                            </p>

                            <p className="mt-3 text-2xl font-bold text-primary">
                                {totalReviews}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Matching current filters
                            </p>
                        </div>

                        <div className="rounded-xl bg-stone-100 p-2.5 text-gray-500">
                            <MessageSquareText size={18} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">
                                Pending
                            </p>

                            <p className="mt-3 text-2xl font-bold text-amber-800">
                                {pendingReviews}
                            </p>

                            <p className="mt-1 text-xs text-amber-700/70">
                                Awaiting moderation
                            </p>
                        </div>

                        <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
                            <Clock3 size={18} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-green-100 bg-green-50/40 p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-600">
                                Approved
                            </p>

                            <p className="mt-3 text-2xl font-bold text-green-800">
                                {approvedReviews}
                            </p>

                            <p className="mt-1 text-xs text-green-700/70">
                                Visible to customers
                            </p>
                        </div>

                        <div className="rounded-xl bg-green-100 p-2.5 text-green-700">
                            <ThumbsUp size={18} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                                Average Rating
                            </p>

                            <p className="mt-3 text-2xl font-bold text-primary">
                                {averageRating.toFixed(1)}
                            </p>

                            <div className="mt-1 flex items-center gap-1">
                                <Star
                                    size={13}
                                    className="fill-yellow-400 text-yellow-400"
                                />

                                <span className="text-xs text-gray-500">
                                    out of 5
                                </span>
                            </div>
                        </div>

                        <div className="rounded-xl bg-stone-100 p-2.5 text-gray-500">
                            <Star size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= Filters + Reviews ================= */}

            <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
                {/* Filter Sidebar */}

                <AdminFilterSidebar clearHref="/admin/reviews">
                    <ReviewFilters />
                </AdminFilterSidebar>

                {/* Review Table */}

                <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                    {/* Section Header */}

                    <div className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                Customer Feedback
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-primary">
                                Review Moderation
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500">
                            {totalReviews}{" "}
                            {totalReviews === 1 ? "review" : "reviews"} found
                        </p>
                    </div>

                    {reviews.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-262.5">
                                <thead className="border-b border-border bg-stone-50/80">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Customer
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Product
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Rating
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Review
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Date
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {reviews.map((review) => (
                                        <tr
                                            key={review.id}
                                            className="group transition hover:bg-stone-50/60"
                                        >
                                            {/* Customer */}

                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-gray-600">
                                                        {review.user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-primary">
                                                            {review.user.name}
                                                        </p>

                                                        <p className="mt-1 max-w-45 truncate text-xs text-gray-400">
                                                            {review.user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Product */}

                                            <td className="px-6 py-5">
                                                <Link
                                                    href={`/products/${review.product.slug}`}
                                                    target="_blank"
                                                    className="font-medium text-primary transition hover:text-accent"
                                                >
                                                    {review.product.name}
                                                </Link>
                                            </td>

                                            {/* Rating */}

                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1">
                                                    {Array.from(
                                                        {
                                                            length: 5,
                                                        },
                                                        (_, index) => (
                                                            <Star
                                                                key={index}
                                                                size={15}
                                                                className={
                                                                    index <
                                                                    review.rating
                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                        : "text-gray-300"
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </div>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    {review.rating}
                                                    /5
                                                </p>
                                            </td>

                                            {/* Review */}

                                            <td className="max-w-70 px-6 py-5">
                                                {review.comment ? (
                                                    <p className="line-clamp-2 text-sm leading-6 text-gray-600">
                                                        {review.comment}
                                                    </p>
                                                ) : (
                                                    <span className="text-xs italic text-gray-400">
                                                        No comment
                                                    </span>
                                                )}
                                            </td>

                                            {/* Status */}

                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                                                        review.approved
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-amber-50 text-amber-700"
                                                    }`}
                                                >
                                                    {review.approved
                                                        ? "Approved"
                                                        : "Pending"}
                                                </span>
                                            </td>

                                            {/* Date */}

                                            <td className="px-6 py-5">
                                                <p className="whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(
                                                        review.createdAt,
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        },
                                                    )}
                                                </p>
                                            </td>

                                            {/* Actions */}

                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end">
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Link
                                                            href={`/admin/reviews/${review.id}`}
                                                        >
                                                            Manage
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-6 py-20 text-center sm:px-8">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-xl">
                                ⭐
                            </div>

                            <h3 className="mt-5 text-lg font-semibold text-primary">
                                No matching reviews
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Try adjusting your search or filter options to
                                find the reviews you are looking for.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AdminReviewsPage;
