interface ShopHeaderProps {
  shopStatus: { isOpen: boolean } | null
  cartItemCount: number
  onCartClick: () => void
}

export default function ShopHeader({ shopStatus, cartItemCount, onCartClick }: ShopHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Fiveka Shop</h1>
            
            {/* Статус магазина */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${shopStatus?.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${shopStatus?.isOpen ? 'text-green-700' : 'text-red-700'}`}>
                {shopStatus?.isOpen ? 'Открыт' : 'Закрыт'}
              </span>
            </div>
          </div>

          {/* Корзина */}
          <button
            onClick={onCartClick}
            className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="mr-2">🛒</span>
            Корзина
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
