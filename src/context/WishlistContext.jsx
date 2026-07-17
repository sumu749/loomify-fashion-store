/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export const WishlistContext = createContext();

const STORAGE_KEY = "loomify-wishlist";

const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    // Add Item
    const addToWishlist = (product) => {
        const exists = wishlistItems.some((item) => item.id === product.id);

        if (exists) {
            toast("Already in wishlist ❤️");
            return;
        }

        setWishlistItems((prev) => [...prev, product]);

        toast.success("Added to Wishlist ❤️");
    };

    // Remove Item
    const removeFromWishlist = (id) => {
        setWishlistItems((prev) => prev.filter((item) => item.id !== id));

        toast.success("Removed from Wishlist");
    };

    // Toggle
    const toggleWishlist = (product) => {
        const exists = wishlistItems.some((item) => item.id === product.id);

        if (exists) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    // Check
    const isInWishlist = (id) => {
        return wishlistItems.some((item) => item.id === id);
    };

    // Clear
    const clearWishlist = () => {
        setWishlistItems([]);
    };

    const value = useMemo(
        () => ({
            wishlistItems,
            wishlistCount: wishlistItems.length,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            clearWishlist,
        }),
        [wishlistItems],
    );

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export default WishlistProvider;
