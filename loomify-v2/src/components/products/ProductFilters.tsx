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
            className="h-12 w-full rounded-full border border-border bg-white px-5 text-sm outline-none transition focus:border-accent sm:w-auto"
        >
            {categories.map((category) => (
                <option key={category} value={category}>
                    {category}
                </option>
            ))}
        </select>
    );
};

export default ProductFilters;
