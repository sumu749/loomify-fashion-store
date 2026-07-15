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
    return (
        <section className="py-24">
            <Container>
                <h1 className="text-5xl font-bold text-primary">
                    All Products
                </h1>

                <p className="mt-4 max-w-xl text-gray-600">
                    Discover our curated collection of premium fashion
                    essentials.
                </p>

                <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <ProductSearch value={search} onChange={setSearch} />

                    <div className="flex flex-col gap-4 sm:flex-row">
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
