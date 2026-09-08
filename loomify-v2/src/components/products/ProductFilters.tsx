/* eslint-disable indent */
interface ProductFiltersProps {
    categories: string[];
    value: string;
    onChange: (value: string) => void;
}

const ProductFilters = ({
    categories,
    value,
    onChange,
}: ProductFiltersProps) => {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-primary outline-none transition focus:border-accent"
        >
            {categories.map((category) => (
                <option key={category} value={category}>
                    {category === "all"
                        ? "All categories"
                        : category.replace(/\b\w/g, (char) =>
                              char.toUpperCase(),
                          )}
                </option>
            ))}
        </select>
    );
};

export default ProductFilters;
