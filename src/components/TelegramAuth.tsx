'use client'

import { useState } from 'react'
import { TelegramUser } from '@/types'

interface TelegramAuthProps {
  onAuth: (user: TelegramUser) => void
}

export default function TelegramAuth({ onAuth }: TelegramAuthProps) {
  const [telegramId, setTelegramId] = useState('')
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const handleTestAuth = () => {
    if (!telegramId) return

    const testUser: TelegramUser = {
      id: parseInt(telegramId),
      username: username || undefined,
      first_name: firstName || undefined,
      last_name: lastName || undefined
    }

    onAuth(testUser)
  }

  return (
    <div className="fixed top-4 left-4 bg-white p-4 rounded-lg shadow-lg border z-40 max-w-xs">
      <h3 className="font-semibold mb-3">Тестовая аутентификация</h3>
      
      <div className="space-y-2 mb-3">
        <input
          type="text"
          placeholder="Telegram ID"
          value={telegramId}
          onChange={(e) => setTelegramId(e.target.value)}
          className="w-full px-2 py-1 border rounded text-sm"
        />
        <input
          type="text"
          placeholder="Username (опционально)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-2 py-1 border rounded text-sm"
        />
        <input
          type="text"
          placeholder="Имя (опционально)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-2 py-1 border rounded text-sm"
        />
        <input
          type="text"
          placeholder="Фамилия (опционально)"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-2 py-1 border rounded text-sm"
        />
      </div>

      <button
        onClick={handleTestAuth}
        disabled={!telegramId}
        className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 disabled:bg-gray-300"
      >
        Войти как пользователь
      </button>

      <div className="mt-2 text-xs text-gray-500">
        Для тестирования админки используйте ID: 123456789
      </div>
    </div>
  )
}
