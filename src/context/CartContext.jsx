/* eslint-disable react-refresh/only-export-components */
/* eslint-disable indent */
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    // Load cart from LocalStorage
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem("loomify-cart");

        return storedCart ? JSON.parse(storedCart) : [];
    });

    // Save cart whenever it changes
    useEffect(() => {
        localStorage.setItem("loomify-cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // Add To Cart

    const addToCart = (product, quantity = 1, size = "", color = "") => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) =>
                    item.id === product.id &&
                    item.size === size &&
                    item.color === color,
            );

            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id &&
                    item.size === size &&
                    item.color === color
                        ? {
                              ...item,
                              quantity: item.quantity + quantity,
                          }
                        : item,
                );
            }

            return [
                ...prevItems,
                {
                    ...product,
                    quantity,
                    size,
                    color,
                },
            ];
        });
    };

    // Remove

    const removeFromCart = (id, size, color) => {
        setCartItems((prev) =>
            prev.filter(
                (item) =>
                    !(
                        item.id === id &&
                        item.size === size &&
                        item.color === color
                    ),
            ),
        );
    };

    // Quantity +

    const increaseQuantity = (id, size, color) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id && item.size === size && item.color === color
                    ? {
                          ...item,
                          quantity: item.quantity + 1,
                      }
                    : item,
            ),
        );
    };

    // Quantity -

    const decreaseQuantity = (id, size, color) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id && item.size === size && item.color === color
                    ? {
                          ...item,
                          quantity: Math.max(1, item.quantity - 1),
                      }
                    : item,
            ),
        );
    };

    // Clear Cart

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,

                addToCart,

                removeFromCart,

                increaseQuantity,

                decreaseQuantity,

                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
