import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

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

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.category === filter);

  return (
    <Layout title="Fresh Produce">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Fresh Produce for Your Business</h1>
              <p className="text-xl mb-6">High-quality bulk vegetables and fruits delivered to your doorstep.</p>
              <a href="#products" className="btn bg-white text-green-600 hover:bg-gray-100 px-6 py-3 font-medium rounded-md inline-block">
                Browse Products
              </a>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://pixabay.com/get/g59c95251614514272dd8bb9cefd8520bc031c0b741f1239905b7269320281017b9a064d780f79e50d4a7697e7937653ea3927c1b278c5459dad10a35dacdb6f5_1280.jpg" 
                alt="Fresh vegetables and fruits" 
                className="rounded-lg shadow-xl max-w-full h-auto"
                style={{ maxHeight: '350px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section id="products" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Fresh Produce</h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
            >
              All Products
            </button>
            <button 
              onClick={() => setFilter('vegetable')}
              className={`px-4 py-2 rounded-full ${filter === 'vegetable' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
            >
              Vegetables
            </button>
            <button 
              onClick={() => setFilter('fruit')}
              className={`px-4 py-2 rounded-full ${filter === 'fruit' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
            >
              Fruits
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-green-500 text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2">Fresh & Quality</h3>
              <p className="text-gray-600">We source directly from farms to ensure the freshest produce for your business.</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-green-500 text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">Bulk Ordering</h3>
              <p className="text-gray-600">Designed for businesses that need large quantities at competitive prices.</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-green-500 text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Reliable Delivery</h3>
              <p className="text-gray-600">Track your orders and get timely deliveries right to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Place Your First Order?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Join hundreds of businesses that trust us for their fresh produce needs.</p>
          <a href="/orders" className="btn btn-primary px-8 py-3 text-lg font-medium">
            Start Ordering Now
          </a>
        </div>
      </section>
    </Layout>
  );
}
