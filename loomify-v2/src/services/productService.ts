import products from "@/data/products";

import type { Product, ProductsResponse } from "@/types/product";

export const getAllProducts = async (): Promise<Product[]> => {
    const response = await fetch("/api/products");

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const result = (await response.json()) as ProductsResponse;

    if (!result.success) {
        throw new Error("Failed to fetch products");
    }

    return result.data;
};

export const getProductById = (id: number | string): Product | undefined => {
    return products.find((product) => product.id === Number(id));
};

export const getFeaturedProducts = (): Product[] => {
    return products.filter((product) => product.featured);
};
