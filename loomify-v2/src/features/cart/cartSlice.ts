import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

interface AddToCartPayload {
    product: Product;
    variantId: string;
    quantity?: number;
}

interface CartState {
    items: CartItem[];
    version: number;
}

const initialState: CartState = {
    items: [],
    version: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,

    reducers: {
        addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
            const { product, variantId, quantity = 1 } = action.payload;

            const existingItem = state.items.find(
                (item) =>
                    item.id === product.id && item.variantId === variantId,
            );

            if (existingItem) {
                existingItem.quantity += quantity;
                state.version += 1;
                return;
            }

            state.items.push({
                ...product,
                quantity,
                variantId,
            });

            state.version += 1;
        },

        removeFromCart: (
            state,
            action: PayloadAction<{
                id: string;
                variantId: string;
            }>,
        ) => {
            const { id, variantId } = action.payload;

            state.items = state.items.filter(
                (item) => !(item.id === id && item.variantId === variantId),
            );

            state.version += 1;
        },

        increaseQuantity: (
            state,
            action: PayloadAction<{
                id: string;
                variantId: string;
            }>,
        ) => {
            const { id, variantId } = action.payload;

            const item = state.items.find(
                (item) => item.id === id && item.variantId === variantId,
            );

            if (item) {
                item.quantity += 1;
                state.version += 1;
            }
        },

        decreaseQuantity: (
            state,
            action: PayloadAction<{
                id: string;
                variantId: string;
            }>,
        ) => {
            const { id, variantId } = action.payload;

            const item = state.items.find(
                (item) => item.id === id && item.variantId === variantId,
            );

            if (item) {
                item.quantity = Math.max(1, item.quantity - 1);
                state.version += 1;
            }
        },

        clearCart: (state) => {
            state.items = [];
            state.version += 1;
        },

        restoreCart: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    restoreCart,
} = cartSlice.actions;

export default cartSlice.reducer;
