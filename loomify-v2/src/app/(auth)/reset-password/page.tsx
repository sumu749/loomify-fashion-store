"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/common/Button";
import { authClient } from "@/lib/auth-client";

const ResetPasswordPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!token) {
            toast.error("This reset link is missing or invalid.");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await authClient.resetPassword({
                newPassword: password,
                token,
            });

            if (error) {
                toast.error(error.message || "Unable to reset your password.");
                return;
            }

            toast.success("Password reset successfully.");
            router.push("/login");
        } catch (error) {
            console.error("Password reset failed:", error);
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
                        Set a new password
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Choose a new password for your Loomify account.
                    </p>
                </div>

                {!token ? (
                    <div className="mt-8 rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-center text-sm leading-6 text-red-700">
                        This password reset link is invalid or has expired.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-primary"
                            >
                                New Password
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

                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="mb-2 block text-sm font-medium text-primary"
                            >
                                Confirm Password
                            </label>

                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                                placeholder="Re-enter your password"
                                autoComplete="new-password"
                                className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition focus:border-accent"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-500">
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

export default ResetPasswordPage;
