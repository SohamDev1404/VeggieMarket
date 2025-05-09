import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import OrderForm from '../components/OrderForm';

export default function OrdersPage() {
  const router = useRouter();
  const { productId, quantity } = router.query;

  return (
    <Layout title="Place Order">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Place Your Bulk Order</h1>
        <div className="max-w-4xl mx-auto">
          <OrderForm initialProductId={productId} initialQuantity={quantity} />
        </div>
      </div>
    </Layout>
  );
}
