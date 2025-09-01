import { Product } from '@/types'

interface ProductGridProps {
  categories: string[]
  products: Product[]
  onAddToCart: (product: Product) => void
}

export default function ProductGrid({ categories, products, onAddToCart }: ProductGridProps) {

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Товары не найдены</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative">
            <img
              src={product.photo}
              alt={product.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'https://via.placeholder.com/300x200?text=No+Image'
              }}
            />
            {!product.isActive && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Недоступен</span>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-blue-600">
                {product.price.toLocaleString('ru-RU')} ₽
              </span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.category}
              </span>
            </div>
            
            <button
              onClick={() => onAddToCart(product)}
              disabled={!product.isActive}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                product.isActive
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {product.isActive ? 'Добавить в корзину' : 'Недоступен'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
