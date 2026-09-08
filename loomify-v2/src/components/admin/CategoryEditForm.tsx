"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";

interface CategoryData {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
}

interface CategoryEditFormProps {
    category: CategoryData;
}

const CategoryEditForm = ({ category }: CategoryEditFormProps) => {
    const router = useRouter();

    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description ?? "");
    const [imageUrl, setImageUrl] = useState(category.imageUrl ?? "");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name.trim()) {
            toast.error("Category name is required.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `/api/admin/categories/${category.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        description: description.trim() || null,
                        imageUrl: imageUrl.trim() || null,
                    }),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to update category.");
                return;
            }

            toast.success("Category updated successfully!");

            router.push("/admin/categories");
            router.refresh();
        } catch (error) {
            console.error("Category update failed:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                {/* Section Header */}

                <div className="border-b border-border bg-stone-50/60 px-6 py-5 sm:px-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        Category Setup
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-primary">
                        Category Information
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                        Update the information for this Loomify product
                        category.
                    </p>
                </div>

                {/* Form Fields */}

                <div className="space-y-6 p-6 sm:p-8">
                    {/* Category Name */}

                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-semibold text-primary"
                        >
                            Category Name
                            <span className="ml-1 text-red-500">*</span>
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="e.g. Men"
                            autoComplete="off"
                            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-stone-100"
                        />

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                            Use a clear and recognizable category name.
                        </p>
                    </div>

                    {/* Slug */}

                    <div>
                        <label
                            htmlFor="slug"
                            className="mb-2 block text-sm font-semibold text-primary"
                        >
                            Category Slug
                        </label>

                        <input
                            id="slug"
                            type="text"
                            value={category.slug}
                            readOnly
                            className="h-12 w-full cursor-not-allowed rounded-xl border border-border bg-stone-50 px-4 font-mono text-sm text-gray-500 outline-none"
                        />

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                            The slug is managed automatically and is shown here
                            for reference.
                        </p>
                    </div>

                    {/* Description */}

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-semibold text-primary"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            rows={5}
                            placeholder="Premium fashion for modern men."
                            className="w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-sm leading-6 text-primary outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-stone-100"
                        />

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                            Keep the description short and useful for catalog
                            organization.
                        </p>
                    </div>

                    {/* Image URL */}

                    <div>
                        <label
                            htmlFor="imageUrl"
                            className="mb-2 block text-sm font-semibold text-primary"
                        >
                            Category Image URL
                        </label>

                        <input
                            id="imageUrl"
                            type="url"
                            value={imageUrl}
                            onChange={(event) =>
                                setImageUrl(event.target.value)
                            }
                            placeholder="https://example.com/category-image.jpg"
                            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-stone-100"
                        />

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                            Add a public image URL or leave it empty if this
                            category does not use an image.
                        </p>
                    </div>
                </div>
            </section>

            {/* Actions */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="secondary"
                    disabled={loading}
                    onClick={() => router.push("/admin/categories")}
                >
                    Cancel
                </Button>

                <Button type="submit" disabled={loading}>
                    {loading ? "Saving Changes..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
};

export default CategoryEditForm;
