export interface Product {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string;

    price: number;
    oldPrice?: number;

    category: string;

    image: string;
    images: string[];

    stock: number;
    featured: boolean;
    published: boolean;

    rating: number;
    reviews: number;
    badge: string;

    colors: string[];
    sizes: string[];
}

export interface ProductsResponse {
    success: boolean;
    data: Product[];
}
