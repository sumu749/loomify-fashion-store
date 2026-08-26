/* eslint-disable indent */
import { useMemo, useState } from "react";

import type { Product } from "@/types/product";

export type ProductSort = "newest" | "low-high" | "high-low" | "rating";

interface ProductFiltersResult {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;

    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;

    categories: string[];

    sort: ProductSort;
    setSort: React.Dispatch<React.SetStateAction<ProductSort>>;

    filteredProducts: Product[];
}

const useProductFilters = (products: Product[]): ProductFiltersResult => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState<ProductSort>("newest");

    const categories = useMemo(() => {
        return ["all", ...new Set(products.map((product) => product.category))];
    }, [products]);

    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Search
        if (search.trim()) {
            const normalizedSearch = search.toLowerCase().trim();

            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(normalizedSearch),
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

            case "newest":
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
