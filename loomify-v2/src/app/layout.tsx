import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";

import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
    title: "Loomify",
    description: "A modern fashion store built with Next.js and TypeScript",
};

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <body>
                <MainLayout>{children}</MainLayout>
                <Toaster position="top-right" />
            </body>
        </html>
    );
}
