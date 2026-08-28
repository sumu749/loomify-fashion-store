"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email.");
            return;
        }

        if (!password) {
            toast.error("Please enter your password.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await authClient.signIn.email({
                email: email.trim(),
                password,
            });

            if (error) {
                toast.error(error.message || "Invalid email or password.");
                return;
            }

            toast.success("Logged in successfully!");

            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Login failed:", error);

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
                        Welcome Back
                    </p>

                    <h1 className="mt-3 text-3xl font-bold text-primary">
                        Login to Loomify
                    </h1>

                    <p className="mt-3 text-sm text-gray-500">
                        Continue your shopping experience.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                        <div className="mb-2 flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-primary"
                            >
                                Password
                            </label>

                            <Link
                                href="/forgot-password"
                                className="text-xs font-medium text-accent hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition focus:border-accent"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/register">Create Account</Link>
                </p>
            </div>
        </section>
    );
};

export default LoginPage;
