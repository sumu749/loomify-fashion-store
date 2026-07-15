import { Search } from "lucide-react";

const ProductSearch = ({ value, onChange }) => {
    return (
        <div className="relative w-full md:max-w-sm">
            <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search products..."
                className="h-12 w-full rounded-full border border-border bg-white pl-11 pr-4 outline-none transition focus:border-accent"
            />
        </div>
    );
};

export default ProductSearch;
