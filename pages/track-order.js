import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import OrderStatus from '../components/OrderStatus';

export default function TrackOrderPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [orderId, setOrderId] = useState(id || '');
  const [showStatus, setShowStatus] = useState(!!id);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (orderId.trim()) {
      router.push({
        pathname: '/track-order',
        query: { id: orderId }
      }, undefined, { shallow: true });
      
      setShowStatus(true);
    }
  };

  return (
    <Layout title="Track Order">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>
        
        <div className="max-w-xl mx-auto mb-10">
          <div className="bg-white shadow-md rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <label htmlFor="orderId" className="form-label">
                Enter your order ID
              </label>
              <div className="flex mt-1">
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. 12345"
                  className="form-input flex-1 rounded-r-none"
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary rounded-l-none"
                >
                  Track
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {showStatus && (
          <div className="max-w-3xl mx-auto">
            <OrderStatus orderId={id} />
          </div>
        )}
      </div>
    </Layout>
  );
}
