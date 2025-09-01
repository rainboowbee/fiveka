import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items, deliveryType, room } = body

    if (!userId || !items || !deliveryType || !room) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Вычисляем общую сумму
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)

    // Создаем заказ
    const order = await prisma.order.create({
      data: {
        userId,
        deliveryType,
        room,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    })

    return NextResponse.json({ order, success: true })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ orders, success: true })

  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
