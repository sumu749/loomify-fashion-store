import { Star } from "lucide-react";

interface ProductReview {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: {
        name: string;
    };
}

interface ProductReviewsProps {
    reviews: ProductReview[];
}

const ProductReviews = ({ reviews }: ProductReviewsProps) => {
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((total, review) => total + review.rating, 0) /
              reviews.length
            : 0;

    const roundedAverage = averageRating.toFixed(1);

    return (
        <section className="border-t border-border bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}

                <div className="mb-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                        Customer Feedback
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
                        Customer Reviews
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                        See what customers are saying about this product.
                    </p>
                </div>

                {/* Rating Summary */}

                <div className="mb-10 rounded-2xl border border-border bg-stone-50 p-6 sm:p-8">
                    {reviews.length > 0 ? (
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div>
                                <p className="text-4xl font-bold text-primary">
                                    {roundedAverage}
                                </p>

                                <div className="mt-2 flex items-center gap-1">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Star
                                            key={index}
                                            size={18}
                                            className={
                                                index <
                                                Math.round(averageRating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold text-primary">
                                    {reviews.length}{" "}
                                    {reviews.length === 1
                                        ? "review"
                                        : "reviews"}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Based on approved customer feedback.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="font-semibold text-primary">
                                No reviews yet
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Be the first customer to share your experience.
                            </p>
                        </div>
                    )}
                </div>

                {/* Review List */}

                {reviews.length > 0 && (
                    <div className="space-y-5">
                        {reviews.map((review) => (
                            <article
                                key={review.id}
                                className="rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div className="flex items-center gap-1">
                                            {Array.from(
                                                { length: 5 },
                                                (_, index) => (
                                                    <Star
                                                        key={index}
                                                        size={16}
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

                                        <p className="mt-3 font-semibold text-primary">
                                            {review.user.name}
                                        </p>
                                    </div>

                                    <span className="text-xs text-gray-400">
                                        {new Date(
                                            review.createdAt,
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>

                                {review.comment && (
                                    <p className="mt-4 text-sm leading-7 text-gray-600">
                                        {review.comment}
                                    </p>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductReviews;
