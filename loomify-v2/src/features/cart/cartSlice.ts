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

const incrementCartVersion = (state: CartState) => {
    state.version = (state.version ?? 0) + 1;
};

const cartSlice = createSlice({
    name: "cart",
    initialState,

    reducers: {
        addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
            const { product, variantId, quantity = 1 } = action.payload;
            const safeQuantity =
                Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

            const existingItem = state.items.find(
                (item) =>
                    item.id === product.id && item.variantId === variantId,
            );

            if (existingItem) {
                existingItem.quantity += safeQuantity;
                incrementCartVersion(state);
                return;
            }

            state.items.push({
                ...product,
                quantity: safeQuantity,
                variantId,
            });

            incrementCartVersion(state);
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

            incrementCartVersion(state);
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
                incrementCartVersion(state);
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
                incrementCartVersion(state);
            }
        },

        clearCart: (state) => {
            state.items = [];
            incrementCartVersion(state);
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
