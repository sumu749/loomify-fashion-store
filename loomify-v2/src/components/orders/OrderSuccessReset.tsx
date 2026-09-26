"use client";

import { useEffect } from "react";

import { clearCart } from "@/features/cart/cartSlice";
import { useAppDispatch } from "@/store/hooks";

const OrderSuccessReset = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(clearCart());
    }, [dispatch]);

    return null;
};

export default OrderSuccessReset;
