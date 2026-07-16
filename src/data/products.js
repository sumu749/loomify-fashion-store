import jacket from "../assets/images/products/jacket.jpg";
import denimJacket from "../assets/images/products/denim-jacket.jpg";
import hoodie from "../assets/images/products/hoodie.jpg";
import tshirt from "../assets/images/products/tshirt.jpg";
import sneakers from "../assets/images/products/sneakers.jpg";
import dress from "../assets/images/products/dress.jpg";
import shirt from "../assets/images/products/shirt.jpg";
import handbag from "../assets/images/products/handbag.jpg";
import runningShoes from "../assets/images/products/running-shoes.jpg";
import sweater from "../assets/images/products/sweater.jpg";
import watch from "../assets/images/products/watch.jpg";
import backpack from "../assets/images/products/backpack.jpg";

const products = [
    {
        id: 1,
        name: "Classic Wool Jacket",
        category: "Men",
        image: jacket,
        images: [jacket, jacket, jacket],
        price: 120,
        oldPrice: 160,
        rating: 4.8,
        reviews: 42,
        badge: "SALE",
        featured: true,
        inStock: true,
        sku: "LM-MJ-001",
        description:
            "A timeless wool jacket crafted with premium fabric for everyday comfort and effortless style.",
        colors: ["Black", "Beige", "Navy"],
        sizes: ["S", "M", "L", "XL"],
    },

    {
        id: 2,
        name: "Casual Denim Jacket",
        category: "Men",
        image: denimJacket,
        images: [denimJacket, denimJacket, denimJacket],
        price: 95,
        oldPrice: 120,
        rating: 4.6,
        reviews: 31,
        badge: "NEW",
        featured: true,
        inStock: true,
        sku: "LM-MJ-002",
        description:
            "Stylish denim jacket with a slim fit and premium cotton fabric for everyday wear.",
        colors: ["Blue", "Black"],
        sizes: ["M", "L", "XL"],
    },

    {
        id: 3,
        name: "Premium Cotton Hoodie",
        category: "Men",
        image: hoodie,
        images: [hoodie, hoodie, hoodie],
        price: 75,
        oldPrice: 90,
        rating: 4.7,
        reviews: 56,
        badge: "HOT",
        featured: true,
        inStock: true,
        sku: "LM-HD-003",
        description:
            "Soft fleece hoodie with adjustable hood and kangaroo pocket for maximum comfort.",
        colors: ["Gray", "Black", "White"],
        sizes: ["S", "M", "L", "XL"],
    },

    {
        id: 4,
        name: "Slim Fit T-Shirt",
        category: "Men",
        image: tshirt,
        images: [tshirt, tshirt, tshirt],
        price: 30,
        oldPrice: 40,
        rating: 4.5,
        reviews: 87,
        badge: "SALE",
        featured: false,
        inStock: true,
        sku: "LM-TS-004",
        description:
            "Breathable cotton t-shirt designed with a slim fit for a modern casual look.",
        colors: ["White", "Black", "Olive"],
        sizes: ["S", "M", "L", "XL"],
    },

    {
        id: 5,
        name: "Leather Sneakers",
        category: "Shoes",
        image: sneakers,
        images: [sneakers, sneakers, sneakers],
        price: 110,
        oldPrice: 145,
        rating: 4.9,
        reviews: 103,
        badge: "BEST",
        featured: true,
        inStock: true,
        sku: "LM-SH-005",
        description:
            "Premium leather sneakers with cushioned sole and lightweight construction.",
        colors: ["White", "Black"],
        sizes: ["40", "41", "42", "43", "44"],
    },

    {
        id: 6,
        name: "Elegant Summer Dress",
        category: "Women",
        image: dress,
        images: [dress, dress, dress],
        price: 85,
        oldPrice: 110,
        rating: 4.8,
        reviews: 49,
        badge: "NEW",
        featured: true,
        inStock: true,
        sku: "LM-WD-006",
        description:
            "Lightweight floral summer dress with soft fabric and elegant silhouette.",
        colors: ["Pink", "Blue", "White"],
        sizes: ["S", "M", "L"],
    },

    {
        id: 7,
        name: "Classic Formal Shirt",
        category: "Men",
        image: shirt,
        images: [shirt, shirt, shirt],
        price: 55,
        oldPrice: 70,
        rating: 4.6,
        reviews: 38,
        badge: "",
        featured: false,
        inStock: true,
        sku: "LM-FS-007",
        description:
            "Wrinkle-resistant formal shirt made with premium cotton fabric.",
        colors: ["White", "Sky Blue"],
        sizes: ["M", "L", "XL"],
    },

    {
        id: 8,
        name: "Women's Handbag",
        category: "Accessories",
        image: handbag,
        images: [handbag, handbag, handbag],
        price: 95,
        oldPrice: 130,
        rating: 4.7,
        reviews: 64,
        badge: "SALE",
        featured: true,
        inStock: false,
        sku: "LM-HB-008",
        description:
            "Elegant handbag crafted with premium faux leather and spacious compartments.",
        colors: ["Brown", "Black", "Cream"],
        sizes: ["One Size"],
    },

    {
        id: 9,
        name: "Sports Running Shoes",
        category: "Shoes",
        image: runningShoes,
        images: [runningShoes, runningShoes, runningShoes],
        price: 130,
        oldPrice: 160,
        rating: 4.9,
        reviews: 91,
        badge: "HOT",
        featured: true,
        inStock: true,
        sku: "LM-RS-009",
        description:
            "Lightweight running shoes with breathable mesh and shock-absorbing sole.",
        colors: ["Black", "Blue", "Red"],
        sizes: ["40", "41", "42", "43", "44"],
    },

    {
        id: 10,
        name: "Women's Oversized Sweater",
        category: "Women",
        image: sweater,
        images: [sweater, sweater, sweater],
        price: 78,
        oldPrice: 100,
        rating: 4.8,
        reviews: 52,
        badge: "NEW",
        featured: false,
        inStock: true,
        sku: "LM-SW-010",
        description:
            "Cozy oversized sweater perfect for chilly days with soft knitted fabric.",
        colors: ["Beige", "Gray", "Brown"],
        sizes: ["S", "M", "L"],
    },

    {
        id: 11,
        name: "Luxury Analog Watch",
        category: "Accessories",
        image: watch,
        images: [watch, watch, watch],
        price: 220,
        oldPrice: 280,
        rating: 4.9,
        reviews: 76,
        badge: "BEST",
        featured: true,
        inStock: true,
        sku: "LM-WT-011",
        description:
            "Elegant stainless steel analog watch with water-resistant design.",
        colors: ["Silver", "Black", "Gold"],
        sizes: ["One Size"],
    },

    {
        id: 12,
        name: "Travel Backpack",
        category: "Accessories",
        image: backpack,
        images: [backpack, backpack, backpack],
        price: 90,
        oldPrice: 120,
        rating: 4.7,
        reviews: 58,
        badge: "SALE",
        featured: false,
        inStock: true,
        sku: "LM-BP-012",
        description:
            "Durable travel backpack with multiple compartments and waterproof material.",
        colors: ["Black", "Gray", "Army Green"],
        sizes: ["One Size"],
    },
];

export default products;
