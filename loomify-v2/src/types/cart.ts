import type { Product } from "@/types/product";

export interface CartItem extends Product {
    quantity: number;
    size: string;
    color: string;
}
