/* eslint-disable indent */
import { useMemo, useState } from "react";

const useProductFilters = (products) => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("newest");

    const categories = useMemo(() => {
        return ["all", ...new Set(products.map((product) => product.category))];
    }, [products]);

    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Search
        if (search.trim()) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(search.toLowerCase()),
            );
        }

        // Category
        if (category !== "all") {
            filtered = filtered.filter(
                (product) => product.category === category,
            );
        }

        // Sort
        switch (sort) {
            case "low-high":
                filtered.sort((a, b) => a.price - b.price);
                break;

            case "high-low":
                filtered.sort((a, b) => b.price - a.price);
                break;

            case "rating":
                filtered.sort((a, b) => b.rating - a.rating);
                break;

            default:
                break;
        }

        return filtered;
    }, [products, search, category, sort]);

    return {
        search,
        setSearch,

        category,
        setCategory,

        sort,
        setSort,

        categories,

        filteredProducts,
    };
};

export default useProductFilters;
