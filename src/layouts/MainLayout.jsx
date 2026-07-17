import "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/common/Loader";

const MainLayout = () => {
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
        <div className="min-h-screen flex flex-col ">
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 pt-16 sm:pt-20">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
