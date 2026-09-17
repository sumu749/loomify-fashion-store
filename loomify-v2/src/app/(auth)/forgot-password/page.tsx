"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";
import { authClient } from "@/lib/auth-client";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await authClient.requestPasswordReset({
                email: email.trim(),
                redirectTo: "/reset-password",
            });

            if (error) {
                toast.error(error.message || "Unable to send the reset email.");
                return;
            }

            setSubmitted(true);
            toast.success("Password reset instructions sent.");
        } catch (error) {
            console.error("Password reset request failed:", error);
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
                        Account Recovery
                    </p>

                    <h1 className="mt-3 text-3xl font-bold text-primary">
                        Forgot your password?
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Enter your email and we&apos;ll send you instructions to
                        reset your password.
                    </p>
                </div>

                {submitted ? (
                    <div className="mt-8 rounded-xl border border-green-100 bg-green-50 px-4 py-4 text-center text-sm leading-6 text-green-800">
                        Check your inbox for a password reset link. If you do
                        not see it, check your spam folder.
                    </div>
                ) : (
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
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="you@example.com"
                                autoComplete="email"
                                className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition focus:border-accent"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-500">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-accent hover:underline"
                    >
                        Back to Login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default ForgotPasswordPage;
