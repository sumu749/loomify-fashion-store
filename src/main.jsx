import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/global.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoutes.jsx";
import CartProvider from "./context/CartContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <CartProvider>
            <RouterProvider router={router} />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 2500,
                }}
            />
        </CartProvider>
    </StrictMode>,
);
