import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/redis'

export async function GET() {
  try {
    // Проверяем кеш
    let categories = await cache.get('categories')

    if (!categories) {
      // Получаем уникальные категории из базы
      const products = await prisma.product.findMany({
        where: { isActive: true },
        select: { category: true }
      })

      categories = [...new Set(products.map((p: { category: string }) => p.category))]

      // Кешируем на 1 час
      await cache.set('categories', categories, 3600)
    }

    return NextResponse.json({ categories, success: true })

  } catch (error) {
    console.error('Categories error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
