import Link from "next/link";

import Button from "@/components/common/Button";

export default function UnauthorizedPage() {
    return (
        <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
            <div className="max-w-lg text-center">
                <p className="text-6xl font-bold text-accent">403</p>

                <h1 className="mt-4 text-3xl font-bold text-primary">
                    Access Denied
                </h1>

                <p className="mt-3 text-gray-500">
                    You do not have permission to access this page.
                </p>

                <div className="mt-8">
                    <Button asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
