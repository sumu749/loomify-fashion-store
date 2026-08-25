import type { ProductSort } from "@/hooks/useProductFilters";

interface SortOption {
    value: ProductSort;
    label: string;
}

const sortOptions: SortOption[] = [
    {
        value: "newest",
        label: "Newest",
    },
    {
        value: "low-high",
        label: "Price: Low to High",
    },
    {
        value: "high-low",
        label: "Price: High to Low",
    },
    {
        value: "rating",
        label: "Highest Rated",
    },
];

export default sortOptions;
