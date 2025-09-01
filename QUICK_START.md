# ⚡ Быстрый старт Fiveka Shop

Минимальная инструкция для быстрого запуска проекта.

## 🚀 Быстрый запуск

### 1. Клонирование и установка
```bash
git clone <repository-url>
cd fiveka-shop
npm install
```

### 2. Создание .env файла
Создайте файл `.env` в корне проекта:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fiveka_shop"
REDIS_URL="redis://localhost:6379"
TELEGRAM_BOT_TOKEN="your_bot_token_here"
ADMIN_TELEGRAM_IDS="123456789"
```

### 3. Запуск базы данных
```bash
docker-compose up -d
```

### 4. Настройка базы данных
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Запуск приложения
```bash
npm run dev
```

Откройте http://localhost:3000

## 🧪 Тестирование

### Тестовая страница
- Перейдите на http://localhost:3000/test
- Нажмите кнопки для тестирования API

### Тестовая аутентификация
- На главной странице используйте форму аутентификации
- Введите Telegram ID: `123456789` для тестирования админки

## 📱 Основные функции

- **Магазин**: Просмотр товаров по категориям
- **Корзина**: Добавление товаров и оформление заказов
- **Админка**: Управление товарами и статусом магазина
- **Telegram**: Интеграция с Telegram Web App

## 🔧 Полезные команды

```bash
# База данных
npm run db:generate    # Генерация Prisma клиента
npm run db:push        # Синхронизация схемы
npm run db:seed        # Заполнение тестовыми данными
npm run db:studio      # Открыть Prisma Studio

# Разработка
npm run dev            # Запуск в режиме разработки
npm run build          # Сборка для продакшна
npm start              # Запуск продакшн версии

# Docker
docker-compose up -d   # Запуск базы данных и Redis
docker-compose down    # Остановка контейнеров
docker-compose logs    # Просмотр логов
```

## 📚 Документация

- **README.md** - Полное описание проекта
- **SETUP.md** - Подробная настройка
- **TELEGRAM_SETUP.md** - Настройка Telegram бота

## 🆘 Быстрая помощь

### Проблемы с базой данных
```bash
docker-compose restart
npm run db:push
```

### Проблемы с Redis
```bash
docker-compose restart redis
```

### Очистка кеша Prisma
```bash
rm -rf node_modules/.prisma
npm run db:generate
```

## 🎯 Следующие шаги

1. **Настройте Telegram бота** (см. TELEGRAM_SETUP.md)
2. **Добавьте свои товары** через админ панель
3. **Настройте webhook** для Telegram
4. **Протестируйте интеграцию** с Telegram Web App

## 📞 Поддержка

- Создайте Issue в репозитории
- Проверьте логи приложения и контейнеров
- Убедитесь, что все переменные окружения настроены
