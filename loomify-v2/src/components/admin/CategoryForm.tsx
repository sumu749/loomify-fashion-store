"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";

const CategoryForm = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name.trim()) {
            toast.error("Category name is required.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/admin/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim() || null,
                    imageUrl: imageUrl.trim() || null,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to create category.");
                return;
            }

            toast.success("Category created successfully!");

            router.push("/admin/categories");
            router.refresh();
        } catch (error) {
            console.error("Category creation failed:", error);

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
                            placeholder="Men"
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
                            placeholder="Premium fashion for modern men."
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
                            placeholder="https://..."
                            className="h-12 w-full rounded-xl border border-border px-4 outline-none transition focus:border-accent"
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            Leave empty if this category does not have an image
                            yet.
                        </p>
                    </div>
                </div>
            </section>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating Category..." : "Create Category"}
                </Button>
            </div>
        </form>
    );
};

export default CategoryForm;
