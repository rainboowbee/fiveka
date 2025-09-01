import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { telegramUser } = body

    if (!telegramUser || !telegramUser.id) {
      return NextResponse.json({ error: 'Invalid telegram user data' }, { status: 400 })
    }

    // Проверяем кеш
    const cacheKey = `user:${telegramUser.id}`
    let user = await cache.get(cacheKey)

    if (!user) {
      // Ищем пользователя в базе
      user = await prisma.user.findUnique({
        where: { telegramId: telegramUser.id.toString() }
      })

      if (!user) {
        // Создаем нового пользователя
        user = await prisma.user.create({
          data: {
            telegramId: telegramUser.id.toString(),
            username: telegramUser.username,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name
          }
        })
      }

      // Кешируем пользователя на 1 час
      await cache.set(cacheKey, user, 3600)
    }

    // Проверяем, является ли пользователь админом
    const adminCacheKey = `admin:${telegramUser.id}`
    let isAdmin = await cache.get(adminCacheKey)

    if (isAdmin === null) {
      const admin = await prisma.admin.findUnique({
        where: { telegramId: telegramUser.id.toString() }
      })
      isAdmin = !!admin
      await cache.set(adminCacheKey, isAdmin, 3600)
    }

    return NextResponse.json({
      user,
      isAdmin,
      success: true
    })

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
