import { prisma } from "@/lib/prisma";

export const getAdminStats = async () => {
    const [totalProducts, totalUsers, totalOrders, revenueResult] =
        await Promise.all([
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
        ]);

    return {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue: Number(revenueResult._sum.total ?? 0),
    };
};
