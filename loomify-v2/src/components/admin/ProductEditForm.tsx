"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";

interface Category {
    id: string;
    name: string;
}

interface ProductImage {
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
}

interface ProductVariant {
    id: string;
    sku: string;
    size: string;
    color: string;
    price: number | null;
    stock: number;
}

interface ProductData {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    featured: boolean;
    published: boolean;
    categoryId: string;
    images: ProductImage[];
    variants: ProductVariant[];
}

interface ProductEditFormProps {
    product: ProductData;
    categories: Category[];
}

const ProductEditForm = ({ product, categories }: ProductEditFormProps) => {
    const router = useRouter();

    const [name, setName] = useState(product.name);

    const [sku, setSku] = useState(product.sku);

    const [description, setDescription] = useState(product.description);

    const [price, setPrice] = useState(String(product.price));

    const [compareAtPrice, setCompareAtPrice] = useState(
        product.compareAtPrice !== null ? String(product.compareAtPrice) : "",
    );

    const [stock, setStock] = useState(String(product.stock));

    const [categoryId, setCategoryId] = useState(product.categoryId);

    const [image, setImage] = useState(product.images[0]?.url ?? "");

    const [sizes, setSizes] = useState(() => {
        const uniqueSizes = [
            ...new Set(product.variants.map((variant) => variant.size)),
        ];

        return uniqueSizes.join(", ");
    });

    const [colors, setColors] = useState(() => {
        const uniqueColors = [
            ...new Set(product.variants.map((variant) => variant.color)),
        ];

        return uniqueColors.join(", ");
    });

    const [featured, setFeatured] = useState(product.featured);

    const [published, setPublished] = useState(product.published);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const parsedSizes = sizes
            .split(",")
            .map((size) => size.trim())
            .filter(Boolean);

        const parsedColors = colors
            .split(",")
            .map((color) => color.trim())
            .filter(Boolean);

        if (!name.trim()) {
            toast.error("Product name is required.");
            return;
        }

        if (!sku.trim()) {
            toast.error("SKU is required.");
            return;
        }

        if (!categoryId) {
            toast.error("Category is required.");
            return;
        }

        if (!price || Number(price) <= 0) {
            toast.error("Please enter a valid price.");
            return;
        }

        if (parsedSizes.length === 0) {
            toast.error("Add at least one size.");
            return;
        }

        if (parsedColors.length === 0) {
            toast.error("Add at least one color.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/admin/products/${product.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    sku: sku.trim(),
                    description: description.trim(),
                    price: Number(price),
                    compareAtPrice: compareAtPrice
                        ? Number(compareAtPrice)
                        : null,
                    stock: Number(stock) || 0,
                    categoryId,
                    image: image.trim(),
                    sizes: parsedSizes,
                    colors: parsedColors,
                    featured,
                    published,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to update product.");
                return;
            }

            toast.success("Product updated successfully!");

            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error("Product update failed:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section className="rounded-card border border-border bg-white p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-primary">
                    Basic Information
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium"
                        >
                            Product Name
                        </label>

                        <input
                            id="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="sku"
                            className="mb-2 block text-sm font-medium"
                        >
                            SKU
                        </label>

                        <input
                            id="sku"
                            value={sku}
                            onChange={(event) => setSku(event.target.value)}
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="mb-2 block text-sm font-medium"
                        >
                            Category
                        </label>

                        <select
                            id="category"
                            value={categoryId}
                            onChange={(event) =>
                                setCategoryId(event.target.value)
                            }
                            className="h-12 w-full rounded-xl border border-border bg-white px-4 outline-none focus:border-accent"
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-5">
                    <label
                        htmlFor="description"
                        className="mb-2 block text-sm font-medium"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={5}
                        className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent"
                    />
                </div>
            </section>

            {/* Pricing */}
            <section className="rounded-card border border-border bg-white p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-primary">
                    Pricing & Inventory
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-3">
                    <div>
                        <label
                            htmlFor="price"
                            className="mb-2 block text-sm font-medium"
                        >
                            Price
                        </label>

                        <input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(event) => setPrice(event.target.value)}
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="compareAtPrice"
                            className="mb-2 block text-sm font-medium"
                        >
                            Compare At Price
                        </label>

                        <input
                            id="compareAtPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={compareAtPrice}
                            onChange={(event) =>
                                setCompareAtPrice(event.target.value)
                            }
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="stock"
                            className="mb-2 block text-sm font-medium"
                        >
                            Stock
                        </label>

                        <input
                            id="stock"
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(event) => setStock(event.target.value)}
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none focus:border-accent"
                        />
                    </div>
                </div>
            </section>

            {/* Options */}
            <section className="rounded-card border border-border bg-white p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-primary">
                    Product Options
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="sizes"
                            className="mb-2 block text-sm font-medium"
                        >
                            Sizes
                        </label>

                        <input
                            id="sizes"
                            value={sizes}
                            onChange={(event) => setSizes(event.target.value)}
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="colors"
                            className="mb-2 block text-sm font-medium"
                        >
                            Colors
                        </label>

                        <input
                            id="colors"
                            value={colors}
                            onChange={(event) => setColors(event.target.value)}
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none focus:border-accent"
                        />
                    </div>
                </div>

                <div className="mt-5">
                    <label
                        htmlFor="image"
                        className="mb-2 block text-sm font-medium"
                    >
                        Image URL
                    </label>

                    <input
                        id="image"
                        type="url"
                        value={image}
                        onChange={(event) => setImage(event.target.value)}
                        className="h-12 w-full rounded-xl border border-border px-4 outline-none focus:border-accent"
                    />
                </div>
            </section>

            {/* Visibility */}
            <section className="rounded-card border border-border bg-white p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-primary">
                    Visibility
                </h2>

                <div className="mt-6 space-y-4">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={featured}
                            onChange={(event) =>
                                setFeatured(event.target.checked)
                            }
                            className="h-4 w-4"
                        />

                        <span className="text-sm">Featured product</span>
                    </label>

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={published}
                            onChange={(event) =>
                                setPublished(event.target.checked)
                            }
                            className="h-4 w-4"
                        />

                        <span className="text-sm">Published</span>
                    </label>
                </div>
            </section>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving Changes..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
};

export default ProductEditForm;
