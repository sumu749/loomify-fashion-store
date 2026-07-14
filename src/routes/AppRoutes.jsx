import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,

        errorElement: <NotFound />,

        children: [
            // Home Page
            {
                index: true,
                element: <Home />,
            },

            // Products Page
            {
                path: "/products",
                element: <Products />,
            },

            // product Details Page
            {
                path: "/products/:id",
                element: <ProductDetails />,
            },

            // Cart Page
            {
                path: "/cart",
                element: <Cart />,
            },
        ],
    },
]);

export default router;
