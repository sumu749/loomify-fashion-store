import products from "@/data/products";
import type { Product } from "@/types/product";

export const getAllProducts = (): Product[] => {
    return products;
};

export const getProductById = (id: number | string): Product | undefined => {
    return products.find((product) => product.id === Number(id));
};

export const getFeaturedProducts = (): Product[] => {
    return products.filter((product) => product.featured);
};
