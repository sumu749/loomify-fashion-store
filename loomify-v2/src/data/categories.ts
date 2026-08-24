import heroImage from "@/assets/images/hero.jpg";
import promiseImage from "@/assets/images/promise.jpg";
import type { Category } from "@/types/category";

const categories: Category[] = [
    { id: 1, title: "Men", image: heroImage.src, products: 28 },
    { id: 2, title: "Women", image: promiseImage.src, products: 36 },
    { id: 3, title: "Accessories", image: heroImage.src, products: 18 },
    { id: 4, title: "Footwear", image: promiseImage.src, products: 24 },
];

export default categories;
