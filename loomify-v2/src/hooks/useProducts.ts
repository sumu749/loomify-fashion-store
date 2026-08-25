import { useMemo } from "react";

import { getAllProducts } from "@/services/productService";
import type { Product } from "@/types/product";

const useProducts = (): Product[] => {
    return useMemo(() => getAllProducts(), []);
};

export default useProducts;
