import { useState, useEffect } from 'react';

export default function OrderStatus({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderId}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Order not found');
          }
          throw new Error('Failed to fetch order details');
        }
        
        const data = await res.json();
        setOrder(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="text-center py-10">Loading order details...</div>;
  if (error) return <div className="bg-red-50 p-4 rounded-md text-red-800">{error}</div>;
  if (!order) return null;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepClass = (orderStatus, stepStatus) => {
    const statusMap = {
      'Pending': 1,
      'In Progress': 2,
      'Delivered': 3
    };
    
    const currentStep = statusMap[orderStatus];
    const stepNumber = statusMap[stepStatus];
    
    if (stepNumber < currentStep) {
      return 'bg-green-500'; // Completed
    } else if (stepNumber === currentStep) {
      return 'bg-blue-500'; // Current
    } else {
      return 'bg-gray-300'; // Upcoming
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Order #{order.id}</h2>
        <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(order.status)}`}>
            {order.status}
          </span>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
            <div className={`flex flex-col justify-center rounded ${getStepClass(order.status, 'Pending')}`} style={{ width: '33.3333%' }}></div>
            <div className={`flex flex-col justify-center rounded ${getStepClass(order.status, 'In Progress')}`} style={{ width: '33.3333%' }}></div>
            <div className={`flex flex-col justify-center rounded ${getStepClass(order.status, 'Delivered')}`} style={{ width: '33.3333%' }}></div>
          </div>
          <div className="flex text-xs text-gray-600 justify-between">
            <div className="w-1/3 text-left">Pending</div>
            <div className="w-1/3 text-center">In Progress</div>
            <div className="w-1/3 text-right">Delivered</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Delivery Details</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-medium">{order.customerName}</p>
            <p className="text-gray-600">{order.contactNumber}</p>
            <p className="text-gray-600">{order.address}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
