const ProductFilters = ({ categories, value, onChange }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 rounded-full border border-border bg-white px-5 outline-none transition focus:border-accent"
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
