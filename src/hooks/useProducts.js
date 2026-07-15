import { useMemo } from "react";
import { getAllProducts } from "../services/productService";

const useProducts = () => {
    const products = useMemo(() => getAllProducts(), []);

    return products;
};

export default useProducts;
