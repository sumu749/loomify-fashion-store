import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/global.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoutes.jsx";
import CartProvider from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import WishlistProvider from "./context/WishlistContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <CartProvider>
            <WishlistProvider>
                <RouterProvider router={router} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 2500,
                    }}
                />
            </WishlistProvider>
        </CartProvider>
    </StrictMode>,
);
