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

export const getRelatedProducts = async (slug: string): Promise<Product[]> => {
    const response = await fetch(`/api/products/${slug}/related`);

    if (!response.ok) {
        throw new Error("Failed to fetch related products");
    }

    const result = (await response.json()) as ProductsResponse;

    if (!result.success) {
        throw new Error("Failed to fetch related products");
    }

    return result.data;
};
