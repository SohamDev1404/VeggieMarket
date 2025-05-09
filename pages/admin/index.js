import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import AdminNav from '../../components/AdminNav';
import { isValidStatus, getNextStatus } from '../../utils/statusHelper';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await res.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!isValidStatus(newStatus)) {
      alert('Invalid status');
      return;
    }

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert('Error updating order: ' + err.message);
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  return (
    <Layout title="Admin Dashboard">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminNav />
          </div>
          
          <div className="md:col-span-3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
                <h2 className="font-bold text-xl">Order Management</h2>
                <button 
                  onClick={fetchOrders}
                  className="text-green-600 hover:text-green-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 border-b bg-white">
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    All Orders
                  </button>
                  <button 
                    onClick={() => setStatusFilter('Pending')}
                    className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => setStatusFilter('In Progress')}
                    className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'In Progress' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'}`}
                  >
                    In Progress
                  </button>
                  <button 
                    onClick={() => setStatusFilter('Delivered')}
                    className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'Delivered' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'}`}
                  >
                    Delivered
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                  <p className="mt-2 text-gray-600">Loading orders...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-600">
                  <p>{error}</p>
                  <button 
                    onClick={fetchOrders}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => {
                        const nextStatus = getNextStatus(order.status);
                        
                        return (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="font-semibold">{order.customerName}</div>
                              <div className="text-xs">{order.contactNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-green-100 text-green-800'}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.orderItems.length} items
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => window.location.href = `/track-order?id=${order.id}`}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                View
                              </button>
                              
                              {nextStatus && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, nextStatus)}
                                  className={`${
                                    nextStatus === 'In Progress' ? 'text-blue-600 hover:text-blue-900' : 
                                    nextStatus === 'Delivered' ? 'text-green-600 hover:text-green-900' : 
                                    'text-gray-600 hover:text-gray-900'
                                  }`}
                                >
                                  Mark as {nextStatus}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
