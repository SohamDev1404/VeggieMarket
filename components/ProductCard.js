import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ProductCard({ product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const handleAddToOrder = () => {
    router.push({
      pathname: '/orders',
      query: { 
        productId: product.id,
        quantity: quantity 
      },
    });
  };

  return (
    <div className="card">
      <div className="h-48 overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-2xl">🥬</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-green-600 font-bold mt-1">${product.price.toFixed(2)} / kg</p>
        
        <div className="mt-4 flex items-center">
          <label className="sr-only" htmlFor={`quantity-${product.id}`}>Quantity</label>
          <select
            id={`quantity-${product.id}`}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="form-input mr-2 py-1"
          >
            {[1, 2, 5, 10, 20].map((value) => (
              <option key={value} value={value}>
                {value} kg
              </option>
            ))}
          </select>
          <button 
            onClick={handleAddToOrder}
            className="btn btn-primary flex-1"
          >
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
}
