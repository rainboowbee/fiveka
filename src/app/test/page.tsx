'use client'

import { useState } from 'react'

export default function TestPage() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<string | null>(null)

  const testEndpoint = async (endpoint: string, method: string = 'GET', body?: any) => {
    setLoading(endpoint)
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined
      })
      
      const data = await response.json()
      setResults((prev: Record<string, any>) => ({ ...prev, [endpoint]: { status: response.status, data } }))
    } catch (error) {
      setResults((prev: Record<string, any>) => ({ ...prev, [endpoint]: { error: (error as Error).message } }))
    } finally {
      setLoading(null)
    }
  }

  const testAuth = () => {
    testEndpoint('auth', 'POST', {
      id: 123456789,
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User'
    })
  }

  const testShopStatus = () => {
    testEndpoint('shop-status', 'POST', { isOpen: true })
  }

  const testProducts = () => {
    testEndpoint('products', 'POST', {
      name: 'Тестовый товар',
      description: 'Описание тестового товара',
      price: 100,
      category: 'Тест',
      photo: 'https://via.placeholder.com/300x300'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Тестирование API</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Тесты</h2>
          
          <button
            onClick={testAuth}
            disabled={loading === 'auth'}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading === 'auth' ? 'Тестирую...' : 'Тест аутентификации'}
          </button>

          <button
            onClick={() => testEndpoint('shop-status')}
            disabled={loading === 'shop-status'}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading === 'shop-status' ? 'Тестирую...' : 'Получить статус магазина'}
          </button>

          <button
            onClick={testShopStatus}
            disabled={loading === 'shop-status'}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 disabled:bg-gray-400"
          >
            {loading === 'shop-status' ? 'Тестирую...' : 'Изменить статус магазина'}
          </button>

          <button
            onClick={() => testEndpoint('categories')}
            disabled={loading === 'categories'}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            {loading === 'categories' ? 'Тестирую...' : 'Получить категории'}
          </button>

          <button
            onClick={() => testEndpoint('products')}
            disabled={loading === 'products'}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading === 'products' ? 'Тестирую...' : 'Получить товары'}
          </button>

          <button
            onClick={testProducts}
            disabled={loading === 'products'}
            className="w-full bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 disabled:bg-gray-400"
          >
            {loading === 'products' ? 'Тестирую...' : 'Создать тестовый товар'}
          </button>

          <button
            onClick={() => testEndpoint('admin')}
            disabled={loading === 'admin'}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading === 'admin' ? 'Тестирую...' : 'Получить данные админки'}
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Результаты</h2>
          <div className="space-y-4">
            {Object.entries(results).map(([endpoint, result]) => (
              <div key={endpoint} className="border rounded p-4">
                <h3 className="font-semibold text-lg mb-2">{endpoint}</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
