import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Получаем статистику
    const [usersCount, productsCount, ordersCount, totalRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true }
      })
    ])

    // Получаем последние заказы
    const recentOrders = await prisma.order.findMany({
      take: 10,
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Получаем всех пользователей
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      stats: {
        usersCount,
        productsCount,
        ordersCount,
        totalRevenue: totalRevenue._sum.totalAmount || 0
      },
      recentOrders,
      users,
      success: true
    })

  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
