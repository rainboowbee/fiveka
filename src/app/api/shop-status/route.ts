import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/redis'

export async function GET() {
  try {
    // Проверяем кеш
    let status = await cache.get('shop_status')

    if (status === null) {
      // Получаем статус из базы
      let shopStatus = await prisma.shopStatus.findFirst()

      if (!shopStatus) {
        // Создаем начальный статус если его нет
        shopStatus = await prisma.shopStatus.create({
          data: { isOpen: false }
        })
      }

      status = shopStatus
      await cache.set('shop_status', status, 300) // кешируем на 5 минут
    }

    return NextResponse.json({ status, success: true })

  } catch (error) {
    console.error('Shop status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { isOpen } = body

    if (typeof isOpen !== 'boolean') {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
    }

    let shopStatus = await prisma.shopStatus.findFirst()

    if (shopStatus) {
      shopStatus = await prisma.shopStatus.update({
        where: { id: shopStatus.id },
        data: { isOpen }
      })
    } else {
      shopStatus = await prisma.shopStatus.create({
        data: { isOpen }
      })
    }

    // Инвалидируем кеш
    await cache.del('shop_status')

    return NextResponse.json({ status: shopStatus, success: true })

  } catch (error) {
    console.error('Update shop status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
