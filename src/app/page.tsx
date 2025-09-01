'use client'

import { useEffect, useState } from 'react'
import { TelegramUser, User, Product, ShopStatus, CartItem } from '@/types'
import ShopHeader from '@/components/ShopHeader'
import ProductGrid from '@/components/ProductGrid'
import Cart from '@/components/Cart'
import AdminButton from '@/components/AdminButton'
import TelegramAuth from '@/components/TelegramAuth'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [shopStatus, setShopStatus] = useState<ShopStatus | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Инициализация Telegram Web App
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
    }
  }, [])

  // Аутентификация пользователя
  const handleAuth = async (telegramUser: TelegramUser) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telegramUser)
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsAdmin(data.isAdmin)
        await loadInitialData()
      }
    } catch (error) {
      console.error('Ошибка аутентификации:', error)
    }
  }

  // Загрузка начальных данных
  const loadInitialData = async () => {
    try {
      const [statusRes, categoriesRes, productsRes] = await Promise.all([
        fetch('/api/shop-status'),
        fetch('/api/categories'),
        fetch('/api/products')
      ])

      if (statusRes.ok) {
        const statusData = await statusRes.json()
        setShopStatus(statusData)
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    } finally {
      setLoading(false)
    }
  }

  // Добавление товара в корзину
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { productId: product.id, quantity: 1, product }]
    })
  }

  // Обновление количества товара в корзине
  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  // Удаление товара из корзины
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId))
  }

  // Очистка корзины
  const clearCart = () => {
    setCart([])
    setIsCartOpen(false)
  }

  // Размещение заказа
  const placeOrder = async (deliveryType: 'PICKUP' | 'DELIVERY', room: string) => {
    if (!user || cart.length === 0) return

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          deliveryType,
          room
        })
      })

      if (response.ok) {
        clearCart()
        alert('Заказ успешно размещен!')
      } else {
        alert('Ошибка при размещении заказа')
      }
    } catch (error) {
      console.error('Ошибка размещения заказа:', error)
      alert('Ошибка при размещении заказа')
    }
  }

  // Обновление статуса магазина
  const updateShopStatus = async (isOpen: boolean) => {
    try {
      const response = await fetch('/api/shop-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen })
      })

      if (response.ok) {
        setShopStatus(prev => prev ? { ...prev, isOpen } : null)
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Тестовая аутентификация (только для разработки) */}
      {!user && <TelegramAuth onAuth={handleAuth} />}

      {/* Заголовок магазина */}
      <ShopHeader
        shopStatus={shopStatus}
        cartItemCount={cart.length}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Кнопка админки */}
      {isAdmin && (
        <AdminButton
          onShopStatusToggle={updateShopStatus}
          shopStatus={shopStatus}
        />
      )}

      {/* Основной контент */}
      <main className="container mx-auto px-4 py-6">
        {user ? (
          <>
            {/* Сетка товаров по категориям */}
            <ProductGrid
              categories={categories}
              products={products}
              onAddToCart={addToCart}
            />

            {/* Корзина */}
            {isCartOpen && (
              <Cart
                items={cart}
                onUpdateQuantity={updateCartItemQuantity}
                onRemove={removeFromCart}
                onPlaceOrder={placeOrder}
                onClose={() => setIsCartOpen(false)}
              />
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Добро пожаловать в Fiveka Shop!</h1>
            <p className="text-gray-600">Используйте форму аутентификации для входа</p>
          </div>
        )}
      </main>
    </div>
  )
}
