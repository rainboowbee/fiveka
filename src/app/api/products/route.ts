import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const cacheKey = category ? `products:${category}` : 'products:all'

    // Проверяем кеш
    let products = await cache.get(cacheKey)

    if (!products) {
      // Получаем товары из базы
      const whereClause = category ? { category, isActive: true } : { isActive: true }
      
      products = await prisma.product.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
      })

      // Кешируем на 30 минут
      await cache.set(cacheKey, products, 1800)
    }

    return NextResponse.json({ products, success: true })

  } catch (error) {
    console.error('Products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, photo, category } = body

    if (!name || !description || !price || !photo || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        photo,
        category
      }
    })

    // Инвалидируем кеш товаров
    await cache.invalidatePattern('products:*')

    return NextResponse.json({ product, success: true })

  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
