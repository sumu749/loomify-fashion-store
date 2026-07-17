import "./Skeleton.css";

const ProductDetailsSkeleton = () => {
    return (
        <section className="py-20">
            <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2">
                {/* Left Image */}

                <div className="skeleton aspect-4/5 w-full rounded-card" />

                {/* Right Content */}

                <div className="space-y-6">
                    <div className="skeleton h-5 w-28 rounded-full" />

                    <div className="skeleton h-10 w-3/4 rounded-lg" />

                    <div className="skeleton h-8 w-32 rounded-lg" />

                    <div className="space-y-3">
                        <div className="skeleton h-4 w-full rounded-lg" />
                        <div className="skeleton h-4 w-11/12 rounded-lg" />
                        <div className="skeleton h-4 w-9/12 rounded-lg" />
                    </div>

                    <div className="skeleton h-12 w-44 rounded-xl" />
                </div>
            </div>
        </section>
    );
};

export default ProductDetailsSkeleton;
