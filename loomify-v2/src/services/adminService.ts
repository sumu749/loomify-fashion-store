import { prisma } from "@/lib/prisma";

export const getAdminStats = async () => {
    const [
        totalProducts,
        totalUsers,
        totalOrders,
        revenueResult,
        orderStatusResult,
    ] = await Promise.all([
        prisma.product.count(),

        prisma.user.count(),

        prisma.order.count(),

        prisma.order.aggregate({
            _sum: {
                total: true,
            },
            where: {
                status: {
                    not: "CANCELLED",
                },
            },
        }),

        prisma.order.groupBy({
            by: ["status"],
            _count: {
                _all: true,
            },
            orderBy: {
                status: "asc",
            },
        }),
    ]);

    const orderStatus = orderStatusResult.reduce(
        (acc, item) => {
            acc[item.status] = item._count._all;

            return acc;
        },
        {} as Record<string, number>,
    );

    return {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue: Number(revenueResult._sum.total ?? 0),
        orderStatus,
    };
};

export const getAdminRecentOrders = async () => {
    return prisma.order.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: 6,
        select: {
            id: true,
            status: true,
            total: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
};

export const getAdminTopProducts = async () => {
    const topProducts = await prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: "desc",
            },
        },
        take: 5,
    });

    if (topProducts.length === 0) {
        return [];
    }

    const productIds = topProducts.map((item) => item.productId);

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds,
            },
        },
        select: {
            id: true,
            name: true,
            price: true,
            images: {
                orderBy: {
                    sortOrder: "asc",
                },
                take: 1,
                select: {
                    url: true,
                },
            },
        },
    });

    return topProducts.map((item) => {
        const product = products.find(
            (currentProduct) => currentProduct.id === item.productId,
        );

        return {
            id: item.productId,
            name: product?.name ?? "Unknown Product",
            price: Number(product?.price ?? 0),
            image: product?.images[0]?.url ?? null,
            sold: item._sum.quantity ?? 0,
        };
    });
};

export const getAdminSalesOverview = async () => {
    const startDate = new Date();

    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);

    const orders = await prisma.order.findMany({
        where: {
            status: {
                not: "CANCELLED",
            },
            createdAt: {
                gte: startDate,
            },
        },
        select: {
            total: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const salesByDate = new Map<
        string,
        {
            revenue: number;
            orders: number;
        }
    >();

    for (let index = 0; index < 7; index++) {
        const date = new Date(startDate);

        date.setDate(startDate.getDate() + index);

        const key = date.toISOString().slice(0, 10);

        salesByDate.set(key, {
            revenue: 0,
            orders: 0,
        });
    }

    for (const order of orders) {
        const key = order.createdAt.toISOString().slice(0, 10);

        const current = salesByDate.get(key);

        if (!current) {
            continue;
        }

        current.revenue += Number(order.total);
        current.orders += 1;
    }

    return Array.from(salesByDate.entries()).map(([date, data]) => ({
        date,
        revenue: Number(data.revenue.toFixed(2)),
        orders: data.orders,
    }));
};
