import { useEffect, useState } from "react";
import ProductGridSkeleton from "../components/skeleton/ProductGridSkeleton";
import Container from "../components/common/Container";
import ProductFilters from "../components/products/ProductFilters";
import ProductGrid from "../components/products/ProductGrid";
import ProductSearch from "../components/products/ProductSearch";
import ProductSort from "../components/products/ProductSort";
import useProductFilters from "../hooks/useProductFilters";
import useProducts from "../hooks/useProducts";

const Products = () => {
    const products = useProducts();

    const {
        search,
        setSearch,

        category,
        setCategory,

        categories,

        sort,
        setSort,

        filteredProducts,
    } = useProductFilters(products);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <section className="py-20">
                <Container>
                    <ProductGridSkeleton />
                </Container>
            </section>
        );
    }

    return (
        <section className="py-16 sm:py-24">
            <Container>
                <h1 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                    All Products
                </h1>

                <p className="mt-3 max-w-xl text-sm text-gray-600 sm:mt-4 sm:text-base">
                    Discover our curated collection of premium fashion
                    essentials.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:mt-10 lg:flex-row lg:items-center lg:justify-between">
                    <ProductSearch value={search} onChange={setSearch} />

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <ProductFilters
                            categories={categories}
                            value={category}
                            onChange={setCategory}
                        />

                        <ProductSort value={sort} onChange={setSort} />
                    </div>
                </div>

                <div className="mt-14">
                    <ProductGrid products={filteredProducts} />
                </div>
            </Container>
        </section>
    );
};

export default Products;
