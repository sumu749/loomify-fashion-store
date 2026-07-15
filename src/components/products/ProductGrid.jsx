import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
    if (!products.length) {
        return (
            <div className="py-20 text-center">
                <h3 className="text-2xl font-semibold text-primary">
                    No Products Found
                </h3>

                <p className="mt-3 text-gray-500">Try changing your filters.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
