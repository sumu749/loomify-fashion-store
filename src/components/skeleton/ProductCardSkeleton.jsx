import "./Skeleton.css";

const ProductCardSkeleton = () => {
    return (
        <article className="overflow-hidden rounded-card border border-border bg-white shadow-sm">
            {/* Image */}

            <div className="skeleton aspect-4/5 w-full" />

            {/* Content */}

            <div className="space-y-4 p-5">
                <div className="space-y-3">
                    <div className="skeleton h-3 w-20 rounded-full" />

                    <div className="skeleton h-6 w-3/4 rounded-lg" />
                </div>

                <div className="flex gap-3">
                    <div className="skeleton h-6 w-20 rounded-lg" />

                    <div className="skeleton h-6 w-16 rounded-lg" />
                </div>

                <div className="skeleton h-5 w-32 rounded-lg" />

                <div className="skeleton h-12 w-full rounded-xl" />
            </div>
        </article>
    );
};

export default ProductCardSkeleton;
