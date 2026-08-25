/* eslint-disable react-hooks/refs */
"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";

import { makeStore, type AppStore } from "./store";

import { restoreCart } from "../features/cart/cartSlice";
import { restoreWishlist } from "../features/wishlist/wishlistSlice";

const CART_STORAGE_KEY = "loomify-cart";
const WISHLIST_STORAGE_KEY = "loomify-wishlist";

interface StoreProviderProps {
    children: React.ReactNode;
}

const StoreProvider = ({ children }: StoreProviderProps) => {
    const storeRef = useRef<AppStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    const store = storeRef.current;

    useEffect(() => {
        try {
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);

            const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);

            if (storedCart) {
                store.dispatch(restoreCart(JSON.parse(storedCart)));
            }

            if (storedWishlist) {
                store.dispatch(restoreWishlist(JSON.parse(storedWishlist)));
            }
        } catch (error) {
            console.error("Failed to restore persisted state:", error);
        }
    }, [store]);

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const state = store.getState();

            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(state.cart.items),
            );

            localStorage.setItem(
                WISHLIST_STORAGE_KEY,
                JSON.stringify(state.wishlist.items),
            );
        });

        return unsubscribe;
    }, [store]);

    return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
