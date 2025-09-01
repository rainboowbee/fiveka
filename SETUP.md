# 🚀 Настройка проекта Fiveka Shop

Подробная инструкция по настройке и запуску проекта.

## 📋 Предварительные требования

- **Node.js** версии 18 или выше
- **npm** или **yarn**
- **Docker** и **Docker Compose**
- **Git**

## 🔧 Пошаговая настройка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd fiveka-shop
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
# Скопируйте пример
cp .env.example .env

# Или создайте вручную
touch .env
```

Заполните файл `.env` следующими переменными:

```env
# База данных
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fiveka_shop"

# Redis
REDIS_URL="redis://localhost:6379"

# Telegram Bot
TELEGRAM_BOT_TOKEN="your_bot_token_here"
TELEGRAM_WEBHOOK_URL="https://yourdomain.com/api/telegram-webhook"
TELEGRAM_WEBHOOK_SECRET="your_webhook_secret_here"

# ID администраторов (через запятую)
ADMIN_TELEGRAM_IDS="123456789,987654321"

# Окружение
NODE_ENV="development"
```

### 4. Запуск базы данных и Redis

```bash
# Запуск в фоновом режиме
docker-compose up -d

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

### 5. Настройка базы данных

```bash
# Генерация Prisma клиента
npm run db:generate

# Синхронизация схемы с базой данных
npm run db:push

# Заполнение тестовыми данными
npm run db:seed
```

### 6. Запуск приложения

```bash
# Режим разработки
npm run dev

# Или продакшн
npm run build
npm start
```

Приложение будет доступно по адресу: **http://localhost:3000**

## 🗄 Настройка базы данных

### PostgreSQL

Если вы используете локальную установку PostgreSQL:

1. Создайте базу данных:
```sql
CREATE DATABASE fiveka_shop;
```

2. Создайте пользователя (опционально):
```sql
CREATE USER fiveka_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE fiveka_shop TO fiveka_user;
```

3. Обновите `DATABASE_URL` в `.env`:
```env
DATABASE_URL="postgresql://fiveka_user:your_password@localhost:5432/fiveka_shop"
```

### Redis

Если вы используете локальную установку Redis:

1. Установите Redis:
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis

# Windows
# Скачайте с https://redis.io/download
```

2. Запустите Redis:
```bash
redis-server
```

3. Обновите `REDIS_URL` в `.env`:
```env
REDIS_URL="redis://localhost:6379"
```

## 🤖 Настройка Telegram Bot

### 1. Создание бота

1. Найдите [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните полученный токен

### 2. Настройка webhook

1. Получите публичный URL вашего приложения (например, через ngrok для локальной разработки)
2. Установите webhook:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://yourdomain.com/api/telegram-webhook",
    "secret_token": "your_webhook_secret_here"
  }'
```

### 3. Настройка команд бота

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setMyCommands" \
  -H "Content-Type: application/json" \
  -d '{
    "commands": [
      {"command": "start", "description": "Запустить магазин"},
      {"command": "help", "description": "Помощь"},
      {"command": "shop", "description": "Открыть магазин"},
      {"command": "status", "description": "Статус магазина"}
    ]
  }'
```

## 🧪 Тестирование

### 1. Тестовая страница

Откройте **http://localhost:3000/test** для тестирования API endpoints.

### 2. Тестирование аутентификации

1. Откройте главную страницу
2. Используйте форму тестовой аутентификации
3. Введите Telegram ID: `123456789` для тестирования админки

### 3. Тестирование API

```bash
# Тест аутентификации
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "id": 123456789,
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User"
  }'

# Тест получения товаров
curl http://localhost:3000/api/products

# Тест получения статуса магазина
curl http://localhost:3000/api/shop-status
```

## 🔍 Отладка

### Просмотр логов

```bash
# Логи приложения
npm run dev

# Логи Docker контейнеров
docker-compose logs -f postgres
docker-compose logs -f redis

# Логи Prisma
DEBUG=prisma:* npm run dev
```

### Проверка базы данных

```bash
# Подключение к PostgreSQL
docker exec -it fiveka_postgres psql -U postgres -d fiveka_shop

# Просмотр таблиц
\dt

# Просмотр данных
SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM orders;
```

### Проверка Redis

```bash
# Подключение к Redis
docker exec -it fiveka_redis redis-cli

# Просмотр ключей
KEYS *

# Просмотр значения
GET "cache:products"
```

## 🚀 Развертывание

### Vercel

1. Подключите репозиторий к [Vercel](https://vercel.com)
2. Настройте переменные окружения в Vercel Dashboard
3. Настройте webhook для Telegram бота

### Docker

```bash
# Сборка образа
docker build -t fiveka-shop .

# Запуск контейнера
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e REDIS_URL="your_redis_url" \
  -e TELEGRAM_BOT_TOKEN="your_bot_token" \
  fiveka-shop
```

## ❗ Частые проблемы

### Ошибка подключения к базе данных

```bash
# Проверьте статус контейнеров
docker-compose ps

# Перезапустите контейнеры
docker-compose restart

# Проверьте логи
docker-compose logs postgres
```

### Ошибка подключения к Redis

```bash
# Проверьте статус Redis
docker-compose logs redis

# Перезапустите Redis
docker-compose restart redis
```

### Ошибки Prisma

```bash
# Очистите кеш Prisma
rm -rf node_modules/.prisma

# Перегенерируйте клиент
npm run db:generate

# Синхронизируйте схему
npm run db:push
```

### Проблемы с Telegram Web App

1. Убедитесь, что приложение запущено в Telegram
2. Проверьте токен бота
3. Проверьте настройки webhook

## 📚 Дополнительные ресурсы

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Telegram Web App API](https://core.telegram.org/bots/webapps)
- [Redis Documentation](https://redis.io/documentation)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

## 🆘 Получение помощи

Если у вас возникли проблемы:

1. Проверьте логи приложения и контейнеров
2. Убедитесь, что все переменные окружения настроены правильно
3. Проверьте, что база данных и Redis запущены
4. Создайте Issue в репозитории с описанием проблемы
