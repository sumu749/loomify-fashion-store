/* eslint-disable indent */

import { useMemo, useState } from "react";

import type { Product } from "@/types/product";

export type ProductSort = "newest" | "low-high" | "high-low" | "rating";

export type ProductAvailability = "all" | "in-stock" | "out-of-stock";

interface ProductFiltersResult {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;

    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;

    categories: string[];

    minPrice: string;
    setMinPrice: React.Dispatch<React.SetStateAction<string>>;

    maxPrice: string;
    setMaxPrice: React.Dispatch<React.SetStateAction<string>>;

    availability: ProductAvailability;
    setAvailability: React.Dispatch<React.SetStateAction<ProductAvailability>>;

    sort: ProductSort;
    setSort: React.Dispatch<React.SetStateAction<ProductSort>>;

    filteredProducts: Product[];
}

const useProductFilters = (products: Product[]): ProductFiltersResult => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [availability, setAvailability] =
        useState<ProductAvailability>("all");

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

        // Minimum price
        if (minPrice.trim()) {
            const minimum = Number(minPrice);

            if (!Number.isNaN(minimum)) {
                filtered = filtered.filter(
                    (product) => product.price >= minimum,
                );
            }
        }

        // Maximum price
        if (maxPrice.trim()) {
            const maximum = Number(maxPrice);

            if (!Number.isNaN(maximum)) {
                filtered = filtered.filter(
                    (product) => product.price <= maximum,
                );
            }
        }

        // Availability
        if (availability === "in-stock") {
            filtered = filtered.filter((product) =>
                product.variants.some((variant) => variant.stock > 0),
            );
        }

        if (availability === "out-of-stock") {
            filtered = filtered.filter(
                (product) =>
                    product.variants.length === 0 ||
                    product.variants.every((variant) => variant.stock <= 0),
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
    }, [products, search, category, minPrice, maxPrice, availability, sort]);

    return {
        search,
        setSearch,

        category,
        setCategory,

        categories,

        minPrice,
        setMinPrice,

        maxPrice,
        setMaxPrice,

        availability,
        setAvailability,

        sort,
        setSort,

        filteredProducts,
    };
};

export default useProductFilters;
