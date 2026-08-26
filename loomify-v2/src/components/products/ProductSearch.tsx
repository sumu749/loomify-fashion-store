import { Search } from "lucide-react";

interface ProductSearchProps {
    value: string;
    onChange: (value: string) => void;
}

const ProductSearch = ({ value, onChange }: ProductSearchProps) => {
    return (
        <div className="relative w-full sm:max-w-sm">
            <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="h-12 w-full rounded-full border border-border bg-white pl-11 pr-4 text-sm outline-none transition focus:border-accent"
            />
        </div>
    );
};

export default ProductSearch;
