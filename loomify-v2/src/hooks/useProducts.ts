"use client";

import { useQuery } from "@tanstack/react-query";

import { getAllProducts } from "@/services/productService";

const useProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts,
    });
};

export default useProducts;
