"use client";

import { FormEvent, useState } from "react";
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
        <form onSubmit={handleSubmit} className="space-y-8">
            <section className="rounded-card border border-border bg-white p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-primary">
                    Category Information
                </h2>

                <div className="mt-6 space-y-5">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium"
                        >
                            Category Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none transition focus:border-accent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium"
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
                            className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-accent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="imageUrl"
                            className="mb-2 block text-sm font-medium"
                        >
                            Image URL
                        </label>

                        <input
                            id="imageUrl"
                            type="url"
                            value={imageUrl}
                            onChange={(event) =>
                                setImageUrl(event.target.value)
                            }
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none transition focus:border-accent"
                        />
                    </div>
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

export default CategoryEditForm;
