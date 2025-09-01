# Fiveka Shop - Telegram Web App

Онлайн магазин товаров, интегрированный с Telegram Web App API. Позволяет пользователям просматривать товары, добавлять их в корзину и оформлять заказы прямо в Telegram.

## 🚀 Основные возможности

- **Аутентификация через Telegram** - автоматическая регистрация пользователей
- **Каталог товаров** - группировка по категориям с фотографиями и описаниями
- **Корзина покупок** - добавление товаров и управление количеством
- **Оформление заказов** - выбор между самовывозом и доставкой
- **Админ панель** - управление товарами, пользователями и статусом магазина
- **Кеширование** - Redis для оптимизации производительности
- **Статус магазина** - отображение открыт/закрыт в реальном времени

## 🛠 Технологии

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **База данных**: PostgreSQL с Prisma ORM
- **Кеширование**: Redis
- **Интеграция**: Telegram Web App API, Telegram Bot API
- **Разработка**: Docker Compose для локальной среды

## 📁 Структура проекта

```
src/
├── app/
│   ├── api/           # API маршруты
│   │   ├── auth/      # Аутентификация
│   │   ├── products/  # Управление товарами
│   │   ├── categories/# Категории товаров
│   │   ├── orders/    # Заказы
│   │   ├── shop-status/# Статус магазина
│   │   ├── admin/     # Админ панель
│   │   └── telegram-webhook/ # Webhook для бота
│   ├── page.tsx       # Главная страница
│   └── test/          # Тестовая страница API
├── components/        # React компоненты
│   ├── ShopHeader.tsx # Заголовок магазина
│   ├── ProductGrid.tsx# Сетка товаров
│   ├── Cart.tsx       # Корзина
│   ├── AdminButton.tsx# Кнопка админки
│   └── TelegramAuth.tsx # Тестовая аутентификация
├── lib/              # Утилиты
│   ├── prisma.ts     # Prisma клиент
│   └── redis.ts      # Redis клиент и кеш
└── types/            # TypeScript типы
    ├── index.ts      # Основные типы
    └── telegram.d.ts # Типы Telegram Web App
```

## 🗄 Модели базы данных

### User
- `id` - уникальный идентификатор
- `telegramId` - ID пользователя в Telegram
- `username` - имя пользователя (опционально)
- `firstName`, `lastName` - имя и фамилия
- `createdAt`, `updatedAt` - временные метки

### Product
- `id` - уникальный идентификатор
- `name` - название товара
- `description` - описание
- `price` - цена
- `category` - категория
- `photo` - URL фотографии
- `isActive` - активен ли товар

### Order
- `id` - уникальный идентификатор заказа
- `userId` - ID пользователя
- `deliveryType` - тип доставки (pickup/delivery)
- `room` - номер комнаты
- `totalAmount` - общая сумма
- `status` - статус заказа
- `createdAt` - дата создания

### Admin
- `id` - уникальный идентификатор
- `telegramId` - ID администратора в Telegram
- `username` - имя пользователя

### ShopStatus
- `id` - уникальный идентификатор
- `isOpen` - открыт ли магазин
- `updatedAt` - время последнего обновления

## 🔌 API Endpoints

### POST /api/auth
Аутентификация пользователя через Telegram
```json
{
  "id": 123456789,
  "username": "user123",
  "first_name": "Иван",
  "last_name": "Иванов"
}
```

### GET /api/products
Получение списка товаров (с фильтрацией по категории)
```
?category=electronics
```

### POST /api/products
Создание нового товара (только для админов)
```json
{
  "name": "Название товара",
  "description": "Описание",
  "price": 1000,
  "category": "Категория",
  "photo": "https://example.com/photo.jpg"
}
```

### GET /api/categories
Получение списка категорий

### GET /api/shop-status
Получение статуса магазина

### POST /api/shop-status
Обновление статуса магазина (только для админов)
```json
{
  "isOpen": true
}
```

### POST /api/orders
Создание нового заказа
```json
{
  "userId": "user_id",
  "items": [
    {
      "productId": "product_id",
      "quantity": 2
    }
  ],
  "deliveryType": "pickup",
  "room": "4401"
}
```

### GET /api/admin
Получение данных для админ панели

### POST /api/telegram-webhook
Webhook для Telegram бота

## 🔧 Установка и запуск

### Предварительные требования
- Node.js 18+
- Docker и Docker Compose
- PostgreSQL (или Docker)
- Redis (или Docker)

### 1. Клонирование и установка зависимостей
```bash
git clone <repository-url>
cd fiveka-shop
npm install
```

### 2. Настройка окружения
Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

Заполните необходимые переменные:
- `DATABASE_URL` - строка подключения к PostgreSQL
- `REDIS_URL` - строка подключения к Redis
- `TELEGRAM_BOT_TOKEN` - токен вашего Telegram бота
- `ADMIN_TELEGRAM_IDS` - ID администраторов (через запятую)

### 3. Запуск базы данных и Redis
```bash
docker-compose up -d
```

### 4. Настройка базы данных
```bash
npm run db:generate  # Генерация Prisma клиента
npm run db:push      # Синхронизация схемы с БД
npm run db:seed      # Заполнение тестовыми данными
```

### 5. Запуск приложения
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## 🧪 Тестирование

Для тестирования API используйте страницу `/test` или отправляйте запросы напрямую к API endpoints.

## 📱 Интеграция с Telegram

### Telegram Web App
Приложение интегрировано с Telegram Web App API для:
- Аутентификации пользователей
- Получения данных пользователя
- Адаптации под тему Telegram

### Telegram Bot
Бот поддерживает команды:
- `/start` - приветствие и ссылка на магазин
- `/help` - справка по командам
- `/shop` - ссылка на магазин
- `/status` - статус магазина

## 🚀 Развертывание

### Vercel
1. Подключите репозиторий к Vercel
2. Настройте переменные окружения
3. Настройте webhook для Telegram бота

### Docker
```bash
docker build -t fiveka-shop .
docker run -p 3000:3000 fiveka-shop
```

## 📝 Лицензия

MIT License

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📞 Поддержка

По вопросам и предложениям создавайте Issues в репозитории.
