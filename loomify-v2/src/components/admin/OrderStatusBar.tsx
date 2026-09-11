"use client";

import { motion } from "framer-motion";

interface OrderStatusBarProps {
    percentage: number;
    color: string;
    delay?: number;
}

const OrderStatusBar = ({
    percentage,
    color,
    delay = 0,
}: OrderStatusBarProps) => {
    return (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
            <motion.div
                initial={{ width: 0 }}
                whileInView={{
                    width: `${percentage}%`,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    duration: 0.7,
                    delay,
                }}
                className={`h-full rounded-full ${color}`}
            />
        </div>
    );
};

export default OrderStatusBar;
