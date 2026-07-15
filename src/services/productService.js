import products from "../data/products";

export const getAllProducts = () => {
    return products;
};

export const getProductById = (id) => {
    return products.find((product) => product.id === Number(id));
};

export const getFeaturedProducts = () => {
    return products.filter((product) => product.featured);
};
