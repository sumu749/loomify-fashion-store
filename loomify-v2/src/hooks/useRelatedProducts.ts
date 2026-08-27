"use client";

import { useQuery } from "@tanstack/react-query";

import { getRelatedProducts } from "@/services/productService";

const useRelatedProducts = (slug: string) => {
    return useQuery({
        queryKey: ["related-products", slug],
        queryFn: () => getRelatedProducts(slug),
        enabled: Boolean(slug),
    });
};

export default useRelatedProducts;
