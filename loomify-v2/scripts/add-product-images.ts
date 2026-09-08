import "dotenv/config";

import { prisma } from "../src/lib/prisma";

const productImages = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80",
    "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
];

async function main() {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: "asc",
        },
        select: {
            id: true,
            name: true,
        },
    });

    if (products.length === 0) {
        console.log("No products found.");
        return;
    }

    for (let index = 0; index < products.length; index++) {
        const product = products[index];

        const imageUrl = productImages[index % productImages.length];

        const existingImage = await prisma.productImage.findFirst({
            where: {
                productId: product.id,
                sortOrder: 0,
            },
        });

        if (existingImage) {
            await prisma.productImage.update({
                where: {
                    id: existingImage.id,
                },
                data: {
                    url: imageUrl,
                    alt: product.name,
                },
            });

            console.log(`Updated image: ${product.name}`);
        } else {
            await prisma.productImage.create({
                data: {
                    productId: product.id,
                    url: imageUrl,
                    alt: product.name,
                    sortOrder: 0,
                },
            });

            console.log(`Added image: ${product.name}`);
        }
    }

    console.log("Product image update completed.");
}

main().catch((error) => {
    console.error("Failed to update product images:", error);
    process.exit(1);
});
