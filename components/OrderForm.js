import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

export default function OrderForm({ initialProductId, initialQuantity }) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Initialize order items if product is passed via query params
  useEffect(() => {
    if (initialProductId && initialQuantity && products.length > 0) {
      const product = products.find(p => p.id === Number(initialProductId));
      if (product) {
        setOrderItems([{
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: Number(initialQuantity),
        }]);
      }
    }
  }, [initialProductId, initialQuantity, products]);

  const addProduct = (e) => {
    e.preventDefault();
    const productId = Number(e.target.product.value);
    const quantity = Number(e.target.quantity.value);
    
    if (productId && quantity > 0) {
      const product = products.find(p => p.id === productId);
      
      // Check if product already exists in order
      const existingItemIndex = orderItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...orderItems];
        updatedItems[existingItemIndex].quantity += quantity;
        setOrderItems(updatedItems);
      } else {
        // Add new item
        setOrderItems([
          ...orderItems,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
          }
        ]);
      }
      
      // Reset form
      e.target.reset();
    }
  };

  const removeItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (orderItems.length === 0) {
      alert('Please add at least one product to your order');
      return;
    }

    setSubmitting(true);
    
    try {
      const orderData = {
        customerName: data.customerName,
        contactNumber: data.contactNumber,
        address: data.address,
        items: orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const result = await response.json();
      setOrderId(result.id);
      setOrderPlaced(true);
      setOrderItems([]);
    } catch (err) {
      alert('Error placing order: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
        <div className="text-center">
          <div className="mb-4 text-green-500 text-5xl">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
          <p className="mb-6">Your order ID is: <span className="font-semibold">{orderId}</span></p>
          <p className="mb-8">You can track your order status using this ID.</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="btn btn-primary"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => router.push(`/track-order?id=${orderId}`)}
              className="btn btn-secondary"
            >
              Track Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Place Your Bulk Order</h2>
      
      {/* Add Products Form */}
      <div className="mb-8 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-semibold mb-4">Add Products</h3>
        <form onSubmit={addProduct} className="flex flex-wrap gap-4">
          <div className="w-full md:w-5/12">
            <label htmlFor="product" className="form-label">Product</label>
            <select 
              id="product" 
              name="product" 
              className="form-input"
              required
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price.toFixed(2)}/kg
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-3/12">
            <label htmlFor="quantity" className="form-label">Quantity (kg)</label>
            <input 
              type="number" 
              id="quantity" 
              name="quantity"
              min="1" 
              defaultValue="1" 
              className="form-input"
              required
            />
          </div>
          
          <div className="w-full md:w-3/12 flex items-end">
            <button type="submit" className="btn btn-primary w-full">
              Add to Order
            </button>
          </div>
        </form>
      </div>
      
      {/* Order Items List */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        {orderItems.length === 0 ? (
          <p className="text-gray-500 italic">No items added to your order yet.</p>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}/kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">Total:</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ${orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Customer Information Form */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerName" className="form-label">Full Name</label>
              <input 
                type="text" 
                id="customerName"
                className={`form-input ${errors.customerName ? 'border-red-500' : ''}`}
                {...register("customerName", { required: "Name is required" })}
              />
              {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>}
            </div>
            
            <div>
              <label htmlFor="contactNumber" className="form-label">Contact Number</label>
              <input 
                type="tel" 
                id="contactNumber"
                className={`form-input ${errors.contactNumber ? 'border-red-500' : ''}`}
                {...register("contactNumber", { 
                  required: "Contact number is required",
                  pattern: {
                    value: /^\d{10,15}$/,
                    message: "Please enter a valid phone number"
                  }
                })}
              />
              {errors.contactNumber && <p className="mt-1 text-sm text-red-600">{errors.contactNumber.message}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="address" className="form-label">Delivery Address</label>
              <textarea 
                id="address"
                rows="3"
                className={`form-input ${errors.address ? 'border-red-500' : ''}`}
                {...register("address", { required: "Address is required" })}
              ></textarea>
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button 
              type="submit" 
              className="btn btn-primary px-8 py-3 text-lg"
              disabled={submitting || orderItems.length === 0}
            >
              {submitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
