"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ReviewStatus = "all" | "pending" | "approved";
type ReviewRating = "all" | "1" | "2" | "3" | "4" | "5";

const ReviewFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        () => searchParams.get("search") ?? "",
    );

    const status = (searchParams.get("status") as ReviewStatus) || "all";

    const rating = (searchParams.get("rating") as ReviewRating) || "all";

    const sort = searchParams.get("sort") ?? "newest";

    const updateFilters = (
        nextSearch: string,
        nextStatus: ReviewStatus,
        nextRating: ReviewRating,
        nextSort: string,
    ) => {
        const params = new URLSearchParams();

        if (nextSearch.trim()) {
            params.set("search", nextSearch.trim());
        }

        if (nextStatus !== "all") {
            params.set("status", nextStatus);
        }

        if (nextRating !== "all") {
            params.set("rating", nextRating);
        }

        if (nextSort !== "newest") {
            params.set("sort", nextSort);
        }

        const query = params.toString();

        router.push(query ? `/admin/reviews?${query}` : "/admin/reviews");
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        updateFilters(search, status, rating, sort);
    };

    const handleStatusChange = (value: ReviewStatus) => {
        updateFilters(search, value, rating, sort);
    };

    const handleRatingChange = (value: ReviewRating) => {
        updateFilters(search, status, value, sort);
    };

    const handleSortChange = (value: string) => {
        updateFilters(search, status, rating, value);
    };

    const clearFilters = () => {
        setSearch("");
        router.push("/admin/reviews");
    };

    const hasActiveFilters =
        Boolean(search.trim()) ||
        status !== "all" ||
        rating !== "all" ||
        sort !== "newest";

    return (
        <div className="space-y-6">
            {/* Search */}

            <form onSubmit={handleSearchSubmit}>
                <label
                    htmlFor="review-search"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                    Search
                </label>

                <div className="relative">
                    <input
                        id="review-search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Customer, product, comment..."
                        className="h-11 w-full rounded-xl border border-border bg-white px-4 pr-10 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-accent"
                    />

                    <button
                        type="submit"
                        aria-label="Search reviews"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-primary"
                    >
                        ↵
                    </button>
                </div>
            </form>

            {/* Status */}

            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                </p>

                <div className="space-y-2">
                    {[
                        ["all", "All reviews"],
                        ["pending", "Pending"],
                        ["approved", "Approved"],
                    ].map(([value, label]) => (
                        <label
                            key={value}
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-stone-50"
                        >
                            <input
                                type="radio"
                                name="review-status"
                                checked={status === value}
                                onChange={() =>
                                    handleStatusChange(value as ReviewStatus)
                                }
                                className="h-4 w-4 accent-black"
                            />

                            <span className="text-sm text-gray-700">
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Rating */}

            <div>
                <label
                    htmlFor="review-rating"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                    Rating
                </label>

                <select
                    id="review-rating"
                    value={rating}
                    onChange={(event) =>
                        handleRatingChange(event.target.value as ReviewRating)
                    }
                    className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-primary outline-none transition focus:border-accent"
                >
                    <option value="all">All ratings</option>
                    <option value="5">5 stars</option>
                    <option value="4">4 stars</option>
                    <option value="3">3 stars</option>
                    <option value="2">2 stars</option>
                    <option value="1">1 star</option>
                </select>
            </div>

            {/* Sort */}

            <div>
                <label
                    htmlFor="review-sort"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                    Sort By
                </label>

                <select
                    id="review-sort"
                    value={sort}
                    onChange={(event) => handleSortChange(event.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-primary outline-none transition focus:border-accent"
                >
                    <option value="newest">Newest first</option>

                    <option value="oldest">Oldest first</option>

                    <option value="highest">Highest rating</option>

                    <option value="lowest">Lowest rating</option>
                </select>
            </div>

            {/* Clear */}

            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-primary hover:bg-stone-50 hover:text-primary"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );
};

export default ReviewFilters;
