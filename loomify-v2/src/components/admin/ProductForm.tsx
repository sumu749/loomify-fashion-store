/* eslint-disable indent */
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";

interface Category {
    id: string;
    name: string;
}

interface VariantInput {
    size: string;
    color: string;
    stock: number;
}

interface ProductFormProps {
    categories: Category[];
}

const ProductForm = ({ categories }: ProductFormProps) => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [sku, setSku] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [compareAtPrice, setCompareAtPrice] = useState("");

    const [sizes, setSizes] = useState("S, M, L, XL");
    const [colors, setColors] = useState("Black, White");

    const [variants, setVariants] = useState<VariantInput[]>([]);

    const [categoryId, setCategoryId] = useState("");

    const [image, setImage] = useState("");

    const [featured, setFeatured] = useState(false);

    const [published, setPublished] = useState(true);

    const [loading, setLoading] = useState(false);

    const generateVariants = () => {
        const parsedSizes = sizes
            .split(",")
            .map((size) => size.trim())
            .filter(Boolean);

        const parsedColors = colors
            .split(",")
            .map((color) => color.trim())
            .filter(Boolean);

        setVariants((currentVariants) => {
            const existingMap = new Map(
                currentVariants.map((variant) => [
                    `${variant.color}__${variant.size}`,
                    variant.stock,
                ]),
            );

            return parsedColors.flatMap((color) =>
                parsedSizes.map((size) => ({
                    color,
                    size,
                    stock: existingMap.get(`${color}__${size}`) ?? 0,
                })),
            );
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name.trim()) {
            toast.error("Product name is required.");
            return;
        }

        if (!sku.trim()) {
            toast.error("SKU is required.");
            return;
        }

        if (!categoryId) {
            toast.error("Please select a category.");
            return;
        }

        if (!price || Number(price) <= 0) {
            toast.error("Please enter a valid price.");
            return;
        }

        const parsedSizes = sizes
            .split(",")
            .map((size) => size.trim())
            .filter(Boolean);

        const parsedColors = colors
            .split(",")
            .map((color) => color.trim())
            .filter(Boolean);

        if (parsedSizes.length === 0) {
            toast.error("Add at least one size.");
            return;
        }

        if (parsedColors.length === 0) {
            toast.error("Add at least one color.");
            return;
        }

        if (variants.length === 0) {
            toast.error("Generate at least one product variant.");
            return;
        }

        setLoading(true);

        try {
            console.log("Submitting variants:", variants);

            const response = await fetch("/api/admin/products", {
                method: "POST",
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
                    categoryId,
                    image: image.trim(),
                    sizes: parsedSizes,
                    colors: parsedColors,
                    variants,
                    featured,
                    published,
                }),
            });

            const hasInvalidStock = variants.some(
                (variant) => variant.stock < 0,
            );

            if (hasInvalidStock) {
                toast.error("Stock cannot be negative.");
                return;
            }

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to create product.");
                return;
            }

            toast.success("Product created successfully!");

            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error("Product creation failed:", error);

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
                            placeholder="Classic Wool Jacket"
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
                            placeholder="LM-MJ-013"
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
                            <option value="">Select category</option>

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
                        placeholder="Describe the product..."
                    />
                </div>
            </section>

            {/* Pricing & Inventory */}

            <section className="rounded-card border border-border bg-white p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-primary">
                    Pricing & Inventory
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
                            placeholder="120"
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
                            placeholder="160"
                        />
                    </div>
                </div>
            </section>

            {/* Product Options */}

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
                            placeholder="S, M, L, XL"
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            Separate sizes with commas.
                        </p>
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
                            placeholder="Black, White"
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            Separate colors with commas.
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="font-semibold text-primary">
                                Variants & Inventory
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Set stock for each size and color combination.
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={generateVariants}
                        >
                            Generate Variants
                        </Button>
                    </div>

                    {variants.length > 0 && (
                        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                            <table className="w-full min-w-125">
                                <thead className="bg-stone-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">
                                            Color
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-semibold">
                                            Size
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-semibold">
                                            Stock
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {variants.map((variant, index) => (
                                        <tr
                                            key={`${variant.color}-${variant.size}`}
                                        >
                                            <td className="px-4 py-3 text-sm font-medium">
                                                {variant.color}
                                            </td>

                                            <td className="px-4 py-3 text-sm">
                                                {variant.size}
                                            </td>

                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={variant.stock}
                                                    onChange={(event) => {
                                                        const value = Number(
                                                            event.target.value,
                                                        );

                                                        setVariants((current) =>
                                                            current.map(
                                                                (
                                                                    item,
                                                                    itemIndex,
                                                                ) =>
                                                                    itemIndex ===
                                                                    index
                                                                        ? {
                                                                              ...item,
                                                                              stock: value,
                                                                          }
                                                                        : item,
                                                            ),
                                                        );
                                                    }}
                                                    className="h-10 w-28 rounded-lg border border-border px-3 outline-none focus:border-accent"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {variants.length === 0 && (
                        <div className="mt-5 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-gray-500">
                            Add sizes and colors, then click{" "}
                            <strong>Generate Variants</strong>.
                        </div>
                    )}
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
                        placeholder="https://..."
                    />
                </div>
            </section>

            {/* Publishing */}

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

                        <span className="text-sm">Publish immediately</span>
                    </label>
                </div>
            </section>

            {/* Submit */}

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating Product..." : "Create Product"}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;
