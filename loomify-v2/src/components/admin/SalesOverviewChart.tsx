"use client";

import { motion } from "framer-motion";

interface SalesOverviewItem {
    date: string;
    revenue: number;
    orders: number;
}

interface SalesOverviewChartProps {
    data: SalesOverviewItem[];
}

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
    }).format(new Date(`${date}T00:00:00`));
};

const formatCurrencyValue = (value: number) => {
    return `$${value.toLocaleString(undefined, {
        maximumFractionDigits: 0,
    })}`;
};

const SalesOverviewChart = ({ data }: SalesOverviewChartProps) => {
    if (data.length === 0) {
        return (
            <div className="flex h-72 items-center justify-center border border-border bg-stone-50">
                <p className="text-sm text-gray-500">
                    No sales data available for the selected period.
                </p>
            </div>
        );
    }

    const maxRevenue = Math.max(...data.map((item) => item.revenue), 1);

    const totalRevenue = data.reduce((total, item) => total + item.revenue, 0);

    const totalOrders = data.reduce((total, item) => total + item.orders, 0);

    const chartWidth = 760;
    const chartHeight = 260;
    const paddingLeft = 58;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 42;

    const innerWidth = chartWidth - paddingLeft - paddingRight;

    const innerHeight = chartHeight - paddingTop - paddingBottom;

    const getX = (index: number) => {
        if (data.length === 1) {
            return paddingLeft + innerWidth / 2;
        }

        return paddingLeft + (index / (data.length - 1)) * innerWidth;
    };

    const getY = (revenue: number) => {
        return paddingTop + innerHeight - (revenue / maxRevenue) * innerHeight;
    };

    const points = data
        .map((item, index) => `${getX(index)},${getY(item.revenue)}`)
        .join(" ");

    const gridLines = 4;

    return (
        <div className="border border-border bg-white p-6 shadow-sm sm:p-8">
            {/* Header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        Sales Performance
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-primary">
                        Revenue Overview
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Revenue from non-cancelled orders over the last 7 days.
                    </p>
                </div>

                <div className="flex gap-6">
                    <div>
                        <p className="text-xs text-gray-400">Revenue</p>

                        <p className="mt-1 text-lg font-bold text-primary">
                            {formatCurrencyValue(totalRevenue)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-400">Orders</p>

                        <p className="mt-1 text-lg font-bold text-primary">
                            {totalOrders}
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="mt-8 overflow-x-auto">
                <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="h-auto min-w-155 w-full overflow-visible"
                    role="img"
                    aria-label="Seven day revenue overview"
                >
                    {/* Grid */}
                    {Array.from({ length: gridLines + 1 }, (_, index) => {
                        const ratio = index / gridLines;

                        const y = paddingTop + innerHeight * ratio;

                        const value = maxRevenue * (1 - ratio);

                        return (
                            <g key={index}>
                                <line
                                    x1={paddingLeft}
                                    x2={chartWidth - paddingRight}
                                    y1={y}
                                    y2={y}
                                    stroke="currentColor"
                                    className="text-border"
                                    strokeWidth="1"
                                />

                                <text
                                    x={paddingLeft - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="fill-gray-400 text-[10px]"
                                >
                                    {formatCurrencyValue(value)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Area */}
                    <motion.polygon
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        points={`${paddingLeft},${
                            paddingTop + innerHeight
                        } ${points} ${
                            chartWidth - paddingRight
                        },${paddingTop + innerHeight}`}
                        className="fill-accent/10"
                    />

                    {/* Line */}
                    <motion.polyline
                        initial={{
                            pathLength: 0,
                            opacity: 0,
                        }}
                        animate={{
                            pathLength: 1,
                            opacity: 1,
                        }}
                        transition={{
                            duration: 1,
                            ease: "easeOut",
                        }}
                        points={points}
                        fill="none"
                        stroke="currentColor"
                        className="text-accent"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Points + labels */}
                    {data.map((item, index) => {
                        const x = getX(index);
                        const y = getY(item.revenue);

                        return (
                            <g key={item.date}>
                                <motion.circle
                                    initial={{
                                        scale: 0,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        delay: 0.7 + index * 0.08,
                                    }}
                                    cx={x}
                                    cy={y}
                                    r="5"
                                    className="fill-white stroke-accent"
                                    strokeWidth="3"
                                />

                                <text
                                    x={x}
                                    y={chartHeight - 14}
                                    textAnchor="middle"
                                    className="fill-gray-400 text-[10px]"
                                >
                                    {formatDate(item.date)}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default SalesOverviewChart;
