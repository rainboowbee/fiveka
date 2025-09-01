# 🤖 Настройка Telegram Bot для Fiveka Shop

Подробная инструкция по созданию и настройке Telegram бота для интеграции с магазином.

## 📱 Создание бота

### 1. Поиск BotFather

1. Откройте Telegram
2. Найдите пользователя [@BotFather](https://t.me/botfather)
3. Нажмите "Start" или отправьте команду `/start`

### 2. Создание нового бота

1. Отправьте команду `/newbot`
2. Введите название для вашего бота (например, "Fiveka Shop")
3. Введите username для бота (должен заканчиваться на "bot", например "fiveka_shop_bot")
4. Сохраните полученный токен - он понадобится для настройки

### 3. Настройка команд бота

Отправьте команду `/setmycommands` и выберите бота, затем отправьте:

```json
[
  {
    "command": "start",
    "description": "🚀 Запустить магазин"
  },
  {
    "command": "help",
    "description": "❓ Помощь по командам"
  },
  {
    "command": "shop",
    "description": "🛍 Открыть магазин"
  },
  {
    "command": "status",
    "description": "📊 Статус магазина"
  },
  {
    "command": "cart",
    "description": "🛒 Корзина покупок"
  },
  {
    "command": "orders",
    "description": "📋 Мои заказы"
  }
]
```

## 🔧 Настройка webhook

### 1. Получение публичного URL

Для локальной разработки используйте ngrok:

```bash
# Установка ngrok
npm install -g ngrok

# Запуск туннеля
ngrok http 3000
```

Скопируйте полученный HTTPS URL (например, `https://abc123.ngrok.io`)

### 2. Установка webhook

Замените `<YOUR_BOT_TOKEN>` на ваш токен и `<YOUR_URL>` на URL от ngrok:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "<YOUR_URL>/api/telegram-webhook",
    "secret_token": "your_secret_token_here"
  }'
```

### 3. Проверка webhook

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

## 📝 Настройка переменных окружения

Добавьте в файл `.env`:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN="your_bot_token_here"
TELEGRAM_WEBHOOK_URL="https://yourdomain.com/api/telegram-webhook"
TELEGRAM_WEBHOOK_SECRET="your_webhook_secret_here"

# ID администраторов (через запятую)
ADMIN_TELEGRAM_IDS="123456789,987654321"
```

## 🎯 Тестирование бота

### 1. Базовые команды

Отправьте боту команды:
- `/start` - должно появиться приветствие
- `/help` - список доступных команд
- `/shop` - ссылка на магазин
- `/status` - текущий статус магазина

### 2. Проверка webhook

1. Отправьте боту любое сообщение
2. Проверьте логи приложения - должно появиться сообщение о получении webhook
3. Проверьте, что бот отвечает на сообщения

## 🚀 Создание Telegram Web App

### 1. Настройка через BotFather

1. Отправьте `/newapp`
2. Выберите вашего бота
3. Введите название приложения
4. Загрузите иконку (512x512 пикселей)
5. Введите краткое описание
6. Укажите URL вашего приложения

### 2. Тестирование Web App

1. Откройте бота в Telegram
2. Нажмите на кнопку "Open App" или используйте команду `/shop`
3. Приложение должно открыться в Telegram

## 🔐 Безопасность

### 1. Валидация webhook

Все входящие webhook'и проверяются на подлинность через `secret_token`.

### 2. Администраторы

Только пользователи с Telegram ID из списка `ADMIN_TELEGRAM_IDS` могут:
- Управлять товарами
- Изменять статус магазина
- Просматривать пользователей и заказы

### 3. Rate Limiting

Рекомендуется добавить rate limiting для API endpoints:

```typescript
// Пример с express-rate-limit
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // максимум 100 запросов с одного IP
})

app.use('/api/', limiter)
```

## 📱 Интеграция с Telegram Web App

### 1. Инициализация

```typescript
useEffect(() => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    tg.ready()
    tg.expand()
    
    // Получение данных пользователя
    const user = tg.initDataUnsafe.user
    if (user) {
      // Аутентификация пользователя
      handleAuth(user)
    }
  }
}, [])
```

### 2. Адаптация под тему

```typescript
const tg = window.Telegram.WebApp

// Установка цвета заголовка
tg.setHeaderColor('#ffffff')

// Установка цвета фона
tg.setBackgroundColor('#f0f0f0')

// Адаптация под цветовую схему
if (tg.colorScheme === 'dark') {
  // Применение темной темы
}
```

### 3. Основная кнопка

```typescript
const tg = window.Telegram.WebApp

// Настройка основной кнопки
tg.MainButton.setText('Оформить заказ')
tg.MainButton.onClick(() => {
  // Логика оформления заказа
})
tg.MainButton.show()
```

## 🧪 Тестирование интеграции

### 1. Локальное тестирование

1. Запустите приложение: `npm run dev`
2. Запустите ngrok: `ngrok http 3000`
3. Обновите webhook URL
4. Протестируйте команды бота

### 2. Тестирование Web App

1. Откройте бота в Telegram
2. Нажмите "Open App"
3. Проверьте аутентификацию
4. Протестируйте функциональность магазина

### 3. Тестирование админки

1. Войдите с Telegram ID из списка администраторов
2. Проверьте доступ к админ панели
3. Протестируйте управление товарами
4. Проверьте изменение статуса магазина

## 🔍 Отладка

### 1. Логи webhook'ов

Проверьте логи приложения при отправке сообщений боту:

```typescript
console.log('Webhook received:', req.body)
```

### 2. Проверка токена

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe"
```

### 3. Проверка webhook

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

### 4. Тестирование API

```bash
# Тест webhook endpoint
curl -X POST http://localhost:3000/api/telegram-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "update_id": 123456789,
    "message": {
      "message_id": 1,
      "from": {
        "id": 123456789,
        "first_name": "Test",
        "username": "testuser"
      },
      "chat": {
        "id": 123456789,
        "type": "private"
      },
      "date": 1234567890,
      "text": "/start"
    }
  }'
```

## 🚀 Продакшн настройка

### 1. Домен и SSL

1. Получите домен с SSL сертификатом
2. Обновите webhook URL на продакшн домен
3. Настройте переменные окружения

### 2. Мониторинг

Добавьте логирование для мониторинга:

```typescript
// Логирование всех webhook'ов
console.log(`[${new Date().toISOString()}] Webhook from ${req.body.message?.from?.id}`)

// Логирование ошибок
console.error(`[${new Date().toISOString()}] Error processing webhook:`, error)
```

### 3. Backup

Регулярно делайте backup базы данных и настройте мониторинг доступности бота.

## 📚 Полезные ссылки

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Web App API](https://core.telegram.org/bots/webapps)
- [BotFather Commands](https://core.telegram.org/bots#commands)
- [Webhook Setup](https://core.telegram.org/bots/webhooks)
- [Telegram Bot Examples](https://github.com/telegram-bot-api/telegram-bot-api)

## ❗ Частые проблемы

### Бот не отвечает

1. Проверьте токен бота
2. Убедитесь, что webhook настроен правильно
3. Проверьте логи приложения
4. Убедитесь, что приложение запущено

### Web App не открывается

1. Проверьте настройки в BotFather
2. Убедитесь, что URL доступен из интернета
3. Проверьте SSL сертификат
4. Проверьте логи приложения

### Ошибки аутентификации

1. Проверьте Telegram ID пользователя
2. Убедитесь, что пользователь существует в базе
3. Проверьте права доступа
4. Проверьте логи аутентификации
