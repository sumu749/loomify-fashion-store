import sortOptions from "../../constants/sortOptions";

const ProductSort = ({ value, onChange }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
