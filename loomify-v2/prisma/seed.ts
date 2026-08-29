import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

const categories = [
    {
        name: "Men",
        slug: "men",
        description: "Premium fashion for modern men.",
        imageUrl: "/images/categories/men.jpg",
    },
    {
        name: "Women",
        slug: "women",
        description: "Timeless fashion for modern women.",
        imageUrl: "/images/categories/women.jpg",
    },
    {
        name: "Accessories",
        slug: "accessories",
        description: "Complete your look with premium accessories.",
        imageUrl: "/images/categories/accessories.jpg",
    },
    {
        name: "Footwear",
        slug: "footwear",
        description: "Comfortable and stylish footwear for every occasion.",
        imageUrl: "/images/categories/footwear.jpg",
    },
];

const products = [
    {
        name: "Classic Wool Jacket",
        slug: "classic-wool-jacket",
        sku: "LM-MJ-001",
        description:
            "A timeless wool jacket crafted with premium fabric for everyday comfort and effortless style.",
        price: 120,
        compareAtPrice: 160,
        featured: true,
        published: true,
        categorySlug: "men",
        image: "/images/products/jacket.jpg",
        colors: ["Black", "Beige", "Navy"],
        sizes: ["S", "M", "L", "XL"],
    },

    {
        name: "Casual Denim Jacket",
        slug: "casual-denim-jacket",
        sku: "LM-MJ-002",
        description:
            "Stylish denim jacket with a slim fit and premium cotton fabric for everyday wear.",
        price: 95,
        compareAtPrice: 120,
        featured: true,
        published: true,
        categorySlug: "men",
        image: "/images/products/denim-jacket.jpg",
        colors: ["Blue", "Black"],
        sizes: ["M", "L", "XL"],
    },

    {
        name: "Premium Cotton Hoodie",
        slug: "premium-cotton-hoodie",
        sku: "LM-HD-003",
        description:
            "Soft fleece hoodie with adjustable hood and kangaroo pocket for maximum comfort.",
        price: 75,
        compareAtPrice: 90,
        featured: true,
        published: true,
        categorySlug: "men",
        image: "/images/products/hoodie.jpg",
        colors: ["Gray", "Black", "White"],
        sizes: ["S", "M", "L", "XL"],
    },

    {
        name: "Slim Fit T-Shirt",
        slug: "slim-fit-t-shirt",
        sku: "LM-TS-004",
        description:
            "Breathable cotton t-shirt designed with a slim fit for a modern casual look.",
        price: 30,
        compareAtPrice: 40,
        featured: false,
        published: true,
        categorySlug: "men",
        image: "/images/products/tshirt.jpg",
        colors: ["White", "Black", "Olive"],
        sizes: ["S", "M", "L", "XL"],
    },

    {
        name: "Leather Sneakers",
        slug: "leather-sneakers",
        sku: "LM-SH-005",
        description:
            "Premium leather sneakers with cushioned sole and lightweight construction.",
        price: 110,
        compareAtPrice: 145,
        featured: true,
        published: true,
        categorySlug: "footwear",
        image: "/images/products/sneakers.jpg",
        colors: ["White", "Black"],
        sizes: ["40", "41", "42", "43", "44"],
    },

    {
        name: "Elegant Summer Dress",
        slug: "elegant-summer-dress",
        sku: "LM-WD-006",
        description:
            "Lightweight floral summer dress with soft fabric and elegant silhouette.",
        price: 85,
        compareAtPrice: 110,
        featured: true,
        published: true,
        categorySlug: "women",
        image: "/images/products/dress.jpg",
        colors: ["Pink", "Blue", "White"],
        sizes: ["S", "M", "L"],
    },

    {
        name: "Classic Formal Shirt",
        slug: "classic-formal-shirt",
        sku: "LM-FS-007",
        description:
            "Wrinkle-resistant formal shirt made with premium cotton fabric.",
        price: 55,
        compareAtPrice: 70,
        featured: false,
        published: true,
        categorySlug: "men",
        image: "/images/products/shirt.jpg",
        colors: ["White", "Sky Blue"],
        sizes: ["M", "L", "XL"],
    },

    {
        name: "Women's Handbag",
        slug: "womens-handbag",
        sku: "LM-HB-008",
        description:
            "Elegant handbag crafted with premium faux leather and spacious compartments.",
        price: 95,
        compareAtPrice: 130,
        featured: true,
        published: true,
        categorySlug: "accessories",
        image: "/images/products/handbag.jpg",
        colors: ["Brown", "Black", "Cream"],
        sizes: ["One Size"],
    },

    {
        name: "Sports Running Shoes",
        slug: "sports-running-shoes",
        sku: "LM-RS-009",
        description:
            "Lightweight running shoes with breathable mesh and shock-absorbing sole.",
        price: 130,
        compareAtPrice: 160,
        featured: true,
        published: true,
        categorySlug: "footwear",
        image: "/images/products/running-shoes.jpg",
        colors: ["Black", "Blue", "Red"],
        sizes: ["40", "41", "42", "43", "44"],
    },

    {
        name: "Women's Oversized Sweater",
        slug: "womens-oversized-sweater",
        sku: "LM-SW-010",
        description:
            "Cozy oversized sweater perfect for chilly days with soft knitted fabric.",
        price: 78,
        compareAtPrice: 100,
        featured: false,
        published: true,
        categorySlug: "women",
        image: "/images/products/sweater.jpg",
        colors: ["Beige", "Gray", "Brown"],
        sizes: ["S", "M", "L"],
    },

    {
        name: "Luxury Analog Watch",
        slug: "luxury-analog-watch",
        sku: "LM-WT-011",
        description:
            "Elegant stainless steel analog watch with water-resistant design.",
        price: 220,
        compareAtPrice: 280,
        featured: true,
        published: true,
        categorySlug: "accessories",
        image: "/images/products/watch.jpg",
        colors: ["Silver", "Black", "Gold"],
        sizes: ["One Size"],
    },

    {
        name: "Travel Backpack",
        slug: "travel-backpack",
        sku: "LM-BP-012",
        description:
            "Durable travel backpack with multiple compartments and waterproof material.",
        price: 90,
        compareAtPrice: 120,
        featured: false,
        published: true,
        categorySlug: "accessories",
        image: "/images/products/backpack.jpg",
        colors: ["Black", "Gray", "Army Green"],
        sizes: ["One Size"],
    },
];

const createVariants = (sku: string, colors: string[], sizes: string[]) => {
    return colors.flatMap((color) =>
        sizes.map((size) => ({
            sku: `${sku}-${color.replace(/\s+/g, "-").toUpperCase()}-${size}`,
            color,
            size,
            stock: 10,
        })),
    );
};

async function main() {
    console.log("🌱 Starting database seed...");

    for (const category of categories) {
        await prisma.category.upsert({
            where: {
                slug: category.slug,
            },
            update: {
                name: category.name,
                description: category.description,
                imageUrl: category.imageUrl,
            },
            create: {
                name: category.name,
                slug: category.slug,
                description: category.description,
                imageUrl: category.imageUrl,
            },
        });
    }

    for (const product of products) {
        const category = await prisma.category.findUnique({
            where: {
                slug: product.categorySlug,
            },
        });

        const variants = createVariants(
            product.sku,
            product.colors,
            product.sizes,
        );

        if (!category) {
            throw new Error(`Category not found: ${product.categorySlug}`);
        }

        const createdProduct = await prisma.product.upsert({
            where: {
                sku: product.sku,
            },
            update: {
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                featured: product.featured,
                published: product.published,
                categoryId: category.id,
            },
            create: {
                name: product.name,
                slug: product.slug,
                sku: product.sku,
                description: product.description,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                featured: product.featured,
                published: product.published,
                categoryId: category.id,
            },
        });

        await prisma.productImage.deleteMany({
            where: {
                productId: createdProduct.id,
            },
        });

        await prisma.productImage.create({
            data: {
                productId: createdProduct.id,
                url: product.image,
                alt: product.name,
                sortOrder: 0,
            },
        });

        // Remove existing variants before reseeding
        await prisma.productVariant.deleteMany({
            where: {
                productId: createdProduct.id,
            },
        });

        // Create product variants with stock values
        for (const variant of variants) {
            await prisma.productVariant.create({
                data: {
                    productId: createdProduct.id,
                    sku: variant.sku,
                    size: variant.size,
                    color: variant.color,
                    stock: variant.stock,
                },
            });
        }
    }

    console.log("✅ Database seed completed successfully.");
}

main()
    .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
