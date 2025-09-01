import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Проверяем, что это сообщение от Telegram
    if (!body.message) {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 })
    }

    const { message } = body
    const { from, text, chat } = message

    // Обрабатываем команды
    if (text === '/start') {
      // Приветственное сообщение
      const welcomeMessage = `
🎉 Добро пожаловать в Fiveka Shop!

Для доступа к магазину перейдите по ссылке:
${process.env.NEXTAUTH_URL || 'http://localhost:3000'}

Используйте команду /help для получения справки.
      `.trim()

      // Здесь можно отправить ответ через Telegram Bot API
      console.log('Welcome message for user:', from.id)
      
      return NextResponse.json({ success: true, message: 'Welcome message sent' })
    }

    if (text === '/help') {
      const helpMessage = `
📚 Доступные команды:

/start - Начать работу с ботом
/help - Показать эту справку
/shop - Открыть магазин
/status - Статус магазина
      `.trim()

      console.log('Help message for user:', from.id)
      
      return NextResponse.json({ success: true, message: 'Help message sent' })
    }

    if (text === '/shop') {
      const shopUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?tg_user_id=${from.id}`
      
      const shopMessage = `
🛍️ Открыть магазин:

${shopUrl}

Нажмите на ссылку выше, чтобы перейти в магазин.
      `.trim()

      console.log('Shop link sent to user:', from.id)
      
      return NextResponse.json({ success: true, message: 'Shop link sent' })
    }

    if (text === '/status') {
      // Получаем статус магазина
      const shopStatus = await prisma.shopStatus.findFirst()
      const isOpen = shopStatus?.isOpen || false
      
      const statusMessage = `
🏪 Статус магазина:

${isOpen ? '🟢 Открыт' : '🔴 Закрыт'}

${isOpen ? 'Вы можете делать заказы прямо сейчас!' : 'Магазин временно закрыт. Попробуйте позже.'}
      `.trim()

      console.log('Status message sent to user:', from.id)
      
      return NextResponse.json({ success: true, message: 'Status message sent' })
    }

    // Неизвестная команда
    const unknownMessage = `
❓ Неизвестная команда: ${text}

Используйте /help для получения списка доступных команд.
    `.trim()

    console.log('Unknown command from user:', from.id, text)
    
    return NextResponse.json({ success: true, message: 'Unknown command handled' })

  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Telegram webhook endpoint' })
}
