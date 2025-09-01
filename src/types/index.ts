export interface User {
  id: string
  telegramId: string
  username?: string
  firstName?: string
  lastName?: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  photo: string
  category: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  user: User
  deliveryType: 'PICKUP' | 'DELIVERY'
  room: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  totalAmount: number
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: Product
  quantity: number
  price: number
}

export interface Admin {
  id: string
  telegramId: string
  username?: string
  createdAt: Date
}

export interface ShopStatus {
  id: string
  isOpen: boolean
  updatedAt: Date
}

export interface CartItem {
  productId: string
  product: Product
  quantity: number
}

export interface TelegramUser {
  id: number
  first_name?: string
  last_name?: string
  username?: string
}
