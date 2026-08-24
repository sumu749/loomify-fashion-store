"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Loader from "../common/Loader";

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1 pt-16 sm:pt-20">{children}</main>

            <Footer />
        </div>
    );
};

export default MainLayout;
