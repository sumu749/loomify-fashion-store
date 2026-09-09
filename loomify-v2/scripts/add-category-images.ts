import "dotenv/config";

import { prisma } from "../src/lib/prisma";

const categoryImages: Record<string, string> = {
    men: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
    women: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    footwear:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    accessories:
        "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&q=80",
};

async function main() {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
        },
    });

    if (categories.length === 0) {
        console.log("No categories found.");
        return;
    }

    for (const category of categories) {
        const imageUrl = categoryImages[category.slug];

        if (!imageUrl) {
            console.log(`No image mapping found for: ${category.name}`);
            continue;
        }

        await prisma.category.update({
            where: {
                id: category.id,
            },
            data: {
                imageUrl,
            },
        });

        console.log(`Updated image: ${category.name}`);
    }

    console.log("Category image update completed.");
}

main().catch((error) => {
    console.error("Failed to update category images:", error);

    process.exit(1);
});
