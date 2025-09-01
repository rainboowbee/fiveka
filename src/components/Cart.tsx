'use client'

import { useState } from 'react'
import { CartItem } from '@/types'

interface CartProps {
  items: CartItem[]
  onClose: () => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onPlaceOrder: (deliveryType: 'PICKUP' | 'DELIVERY', room: string) => Promise<void>
}

export default function Cart({ items, onClose, onUpdateQuantity, onRemove, onPlaceOrder }: CartProps) {
  const [deliveryType, setDeliveryType] = useState<'PICKUP' | 'DELIVERY'>('PICKUP')
  const [room, setRoom] = useState('4401')
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  const handleCheckout = async () => {
    if (items.length === 0) return
    
    setIsCheckingOut(true)
    
    try {
      // Вызываем функцию создания заказа
      await onPlaceOrder(deliveryType, room)
      onClose()
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Корзина</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Корзина пуста</p>
            </div>
          ) : (
            <>
              {/* Товары в корзине */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                 {items.map(item => (
                  <div key={item.productId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.product.photo}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm">{item.product.price} ₽</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Итого */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Итого:</span>
                  <span>{total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              {/* Тип доставки */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Тип доставки:</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                                         <input
                       type="radio"
                       value="PICKUP"
                       checked={deliveryType === 'PICKUP'}
                       onChange={(e) => {
                         setDeliveryType('PICKUP')
                         setRoom('4401')
                       }}
                       className="mr-2"
                     />
                     Самовывоз
                   </label>
                   <label className="flex items-center">
                     <input
                       type="radio"
                       value="DELIVERY"
                       checked={deliveryType === 'DELIVERY'}
                       onChange={(e) => setDeliveryType('DELIVERY')}
                       className="mr-2"
                     />
                     Доставка
                  </label>
                </div>
              </div>

              {/* Номер комнаты */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Номер комнаты:</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Введите номер комнаты"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Кнопка оформления */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? 'Оформляем заказ...' : 'Оформить заказ'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
