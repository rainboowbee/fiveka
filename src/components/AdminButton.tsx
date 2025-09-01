'use client'

import { useState } from 'react'
import { Product, User, Order } from '@/types'

interface AdminButtonProps {
  onShopStatusToggle: (isOpen: boolean) => void
  shopStatus: { isOpen: boolean } | null
}

export default function AdminButton({ onShopStatusToggle, shopStatus: initialShopStatus }: AdminButtonProps) {
  const [showAdmin, setShowAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'orders' | 'settings'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [shopStatus, setShopStatus] = useState<{ isOpen: boolean }>(initialShopStatus || { isOpen: false })
  const [loading, setLoading] = useState(false)

  const loadAdminData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin')
      const data = await response.json()
      if (data.success) {
        setProducts(data.products || [])
        setUsers(data.users || [])
        setOrders(data.recentOrders || [])
      }
    } catch (error) {
      console.error('Load admin data error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShopStatusToggle = async () => {
    try {
      const newStatus = !shopStatus.isOpen
      const response = await fetch('/api/shop-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: newStatus })
      })
      
      const data = await response.json()
      if (data.success) {
        setShopStatus(data.status)
        // Вызываем переданный пропс для обновления статуса в родительском компоненте
        onShopStatusToggle(newStatus)
      }
    } catch (error) {
      console.error('Toggle shop status error:', error)
    }
  }

  const openAdmin = () => {
    setShowAdmin(true)
    loadAdminData()
  }

  return (
    <>
      <button
        onClick={openAdmin}
        className="fixed top-20 right-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors z-40"
      >
        🔧 Админка
      </button>

      {showAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Панель администратора</h2>
                <button
                  onClick={() => setShowAdmin(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Табы */}
              <div className="flex space-x-1 mb-6 border-b">
                {[
                  { id: 'products', label: 'Товары' },
                  { id: 'users', label: 'Пользователи' },
                  { id: 'orders', label: 'Заказы' },
                  { id: 'settings', label: 'Настройки' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Содержимое табов */}
              <div className="overflow-y-auto max-h-96">
                {activeTab === 'products' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Управление товарами</h3>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        + Добавить товар
                      </button>
                    </div>
                    {loading ? (
                      <p>Загрузка...</p>
                    ) : (
                      <div className="space-y-2">
                        {products.map(product => (
                          <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="flex items-center space-x-3">
                              <img src={product.photo} alt={product.name} className="w-12 h-12 object-cover rounded" />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-600">{product.price} ₽</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">✏️</button>
                              <button className="bg-red-500 text-white px-2 py-1 rounded text-sm">🗑️</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'users' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Пользователи</h3>
                    {loading ? (
                      <p>Загрузка...</p>
                    ) : (
                      <div className="space-y-2">
                        {users.map(user => (
                          <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-gray-600">@{user.username}</p>
                              <p className="text-xs text-gray-500">ID: {user.telegramId}</p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Последние заказы</h3>
                    {loading ? (
                      <p>Загрузка...</p>
                    ) : (
                      <div className="space-y-2">
                        {orders.map(order => (
                          <div key={order.id} className="p-3 bg-gray-50 rounded">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">Заказ #{order.id.slice(-6)}</p>
                                <p className="text-sm text-gray-600">
                                  {order.user.firstName} {order.user.lastName}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${
                                order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {order.deliveryType === 'DELIVERY' ? 'Доставка' : 'Самовывоз'} - {order.room}
                            </p>
                            <p className="text-sm font-medium">{order.totalAmount} ₽</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Настройки магазина</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Статус магазина</p>
                          <p className="text-sm text-gray-600">
                            {shopStatus.isOpen ? 'Магазин открыт' : 'Магазин закрыт'}
                          </p>
                        </div>
                        <button
                          onClick={handleShopStatusToggle}
                          className={`px-4 py-2 rounded font-medium ${
                            shopStatus.isOpen
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {shopStatus.isOpen ? 'Закрыть' : 'Открыть'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
