"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";
import { authClient } from "@/lib/auth-client";

const RegisterPage = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name.trim()) {
            toast.error("Please enter your name.");
            return;
        }

        if (!email.trim()) {
            toast.error("Please enter your email.");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await authClient.signUp.email({
                name: name.trim(),
                email: email.trim(),
                password,
            });

            if (error) {
                toast.error(error.message || "Failed to create account.");
                return;
            }

            toast.success("Account created successfully!");

            router.push("/login");
        } catch (error) {
            console.error("Registration failed:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-card border border-border bg-white p-6 shadow-card sm:p-8">
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
                        Welcome to Loomify
                    </p>

                    <h1 className="mt-3 text-3xl font-bold text-primary">
                        Create an Account
                    </h1>

                    <p className="mt-3 text-sm text-gray-500">
                        Join Loomify and start shopping.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter your name"
                            autoComplete="name"
                            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition focus:border-accent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition focus:border-accent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-primary"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Minimum 8 characters"
                            autoComplete="new-password"
                            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition focus:border-accent"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-accent hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default RegisterPage;
