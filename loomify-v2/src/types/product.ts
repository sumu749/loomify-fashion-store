export interface Product {
    id: number;
    name: string;
    category: string;
    image: string;
    images: string[];
    price: number;
    oldPrice?: number;
    rating: number;
    reviews: number;
    badge: string;
    featured: boolean;
    inStock: boolean;
    sku: string;
    description: string;
    colors: string[];
    sizes: string[];
}
