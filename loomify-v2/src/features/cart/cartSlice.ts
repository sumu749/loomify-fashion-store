import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

interface AddToCartPayload {
    product: Product;
    quantity?: number;
    size?: string;
    color?: string;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,

    reducers: {
        addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
            const {
                product,
                quantity = 1,
                size = "",
                color = "",
            } = action.payload;

            const existingItem = state.items.find(
                (item) =>
                    item.id === product.id &&
                    item.size === size &&
                    item.color === color,
            );

            if (existingItem) {
                existingItem.quantity += quantity;
                return;
            }

            state.items.push({
                ...product,
                quantity,
                size,
                color,
            });
        },

        removeFromCart: (
            state,
            action: PayloadAction<{
                id: number;
                size: string;
                color: string;
            }>,
        ) => {
            const { id, size, color } = action.payload;

            state.items = state.items.filter(
                (item) =>
                    !(
                        item.id === id &&
                        item.size === size &&
                        item.color === color
                    ),
            );
        },

        increaseQuantity: (
            state,
            action: PayloadAction<{
                id: number;
                size: string;
                color: string;
            }>,
        ) => {
            const { id, size, color } = action.payload;

            const item = state.items.find(
                (item) =>
                    item.id === id &&
                    item.size === size &&
                    item.color === color,
            );

            if (item) {
                item.quantity += 1;
            }
        },

        decreaseQuantity: (
            state,
            action: PayloadAction<{
                id: number;
                size: string;
                color: string;
            }>,
        ) => {
            const { id, size, color } = action.payload;

            const item = state.items.find(
                (item) =>
                    item.id === id &&
                    item.size === size &&
                    item.color === color,
            );

            if (item) {
                item.quantity = Math.max(1, item.quantity - 1);
            }
        },

        clearCart: (state) => {
            state.items = [];
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
