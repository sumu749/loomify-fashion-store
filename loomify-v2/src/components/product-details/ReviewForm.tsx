"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";
import { authClient } from "@/lib/auth-client";

interface ReviewFormProps {
    productId: string;
}

const ReviewForm = ({ productId }: ReviewFormProps) => {
    const { data: session, isPending } = authClient.useSession();

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasExistingReview, setHasExistingReview] = useState(false);

    const [isCheckingReview, setIsCheckingReview] = useState(true);

    useEffect(() => {
        const checkReviewStatus = async () => {
            if (!session) {
                setHasExistingReview(false);
                setIsCheckingReview(false);
                return;
            }

            try {
                const response = await fetch(
                    `/api/reviews?productId=${productId}`,
                );

                const result = await response.json();

                if (result.success) {
                    setHasExistingReview(result.data.hasReviewed);
                }
            } catch (error) {
                console.error("Failed to check review status:", error);
            } finally {
                setIsCheckingReview(false);
            }
        };

        if (!isPending) {
            checkReviewStatus();
        }
    }, [session, isPending, productId]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!session) {
            toast.error("Please login to submit a review.");
            return;
        }

        if (rating < 1 || rating > 5) {
            toast.error("Please select a rating.");
            return;
        }

        if (comment.trim().length > 1000) {
            toast.error("Review comment cannot exceed 1000 characters.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    productId,
                    rating,
                    comment: comment.trim() || null,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                toast.error(result.message || "Failed to submit review.");
                return;
            }

            toast.success("Review submitted and is awaiting approval.");

            setRating(0);
            setHoverRating(0);
            setComment("");

            window.location.reload();
        } catch (error) {
            console.error("Failed to submit review:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPending) {
        return (
            <div className="mt-8 animate-pulse rounded-2xl bg-stone-50 p-6">
                <div className="h-5 w-32 rounded bg-gray-200" />
                <div className="mt-4 h-12 rounded bg-gray-200" />
            </div>
        );
    }

    if (isCheckingReview) {
        return (
            <div className="mt-8 animate-pulse rounded-2xl bg-stone-50 p-6">
                <div className="h-5 w-32 rounded bg-gray-200" />

                <div className="mt-4 h-12 rounded bg-gray-200" />

                <div className="mt-3 h-20 rounded bg-gray-200" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="mt-8 rounded-2xl border border-border bg-stone-50 p-6">
                <h3 className="font-semibold text-primary">
                    Want to share your experience?
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                    Please log in to leave a review for this product.
                </p>
            </div>
        );
    }

    if (hasExistingReview) {
        return (
            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
                <h3 className="font-semibold text-primary">
                    Review already submitted
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                    You have already reviewed this product.
                </p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-border bg-stone-50 p-6 sm:p-8"
        >
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    Share Your Experience
                </p>

                <h3 className="mt-2 text-xl font-semibold text-primary">
                    Write a Review
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    Your review will be published after admin approval.
                </p>
            </div>

            {/* Rating */}

            <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-primary">
                    Your Rating
                </p>

                <div
                    className="flex items-center gap-1"
                    onMouseLeave={() => setHoverRating(0)}
                >
                    {Array.from({ length: 5 }, (_, index) => {
                        const star = index + 1;

                        const isActive = star <= (hoverRating || rating);

                        return (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                aria-label={`${star} star${
                                    star === 1 ? "" : "s"
                                }`}
                                className="rounded-md p-1 transition hover:scale-110"
                            >
                                <Star
                                    size={24}
                                    className={
                                        isActive
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                    }
                                />
                            </button>
                        );
                    })}

                    <span className="ml-2 text-sm text-gray-500">
                        {rating > 0 ? `${rating}/5` : "Select a rating"}
                    </span>
                </div>
            </div>

            {/* Comment */}

            <div className="mt-6">
                <label
                    htmlFor="review-comment"
                    className="mb-2 block text-sm font-medium text-primary"
                >
                    Your Review
                </label>

                <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    maxLength={1000}
                    rows={5}
                    placeholder="Tell us about the product..."
                    className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm leading-6 text-primary outline-none transition placeholder:text-gray-400 focus:border-accent"
                />

                <div className="mt-2 flex justify-end">
                    <span className="text-xs text-gray-400">
                        {comment.length}/1000
                    </span>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="mt-5"
            >
                {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    );
};

export default ReviewForm;
