import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Product } from "@/types/product";

interface WishlistState {
    items: Product[];
}

const initialState: WishlistState = {
    items: [],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,

    reducers: {
        addToWishlist: (state, action: PayloadAction<Product>) => {
            const exists = state.items.some(
                (item) => item.id === action.payload.id,
            );

            if (!exists) {
                state.items.push(action.payload);
            }
        },

        removeFromWishlist: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload,
            );
        },

        toggleWishlist: (state, action: PayloadAction<Product>) => {
            const product = action.payload;

            const index = state.items.findIndex(
                (item) => item.id === product.id,
            );

            if (index === -1) {
                state.items.push(product);
            } else {
                state.items.splice(index, 1);
            }
        },

        clearWishlist: (state) => {
            state.items = [];
        },
        restoreWishlist: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
        },
    },
});

export const {
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    restoreWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
