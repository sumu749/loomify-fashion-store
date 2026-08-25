import sortOptions from "@/constants/sortOptions";
import type { ProductSort } from "@/hooks/useProductFilters";

interface ProductSortProps {
    value: ProductSort;
    onChange: (value: ProductSort) => void;
}

const ProductSort = ({ value, onChange }: ProductSortProps) => {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value as ProductSort)}
            className="h-12 w-full rounded-full border border-border bg-white px-5 text-sm outline-none transition focus:border-accent sm:w-auto"
        >
            {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default ProductSort;
