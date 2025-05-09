import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children, title = 'Harvest Hub' }) {
  const router = useRouter();
  
  const isActive = (path) => {
    return router.pathname === path ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-600 hover:text-green-500';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title} | Bulk Vegetable & Fruit Orders</title>
        <meta name="description" content="Order fresh vegetables and fruits in bulk" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-green-600 flex items-center">
              <span className="mr-2">🥬</span> Harvest Hub
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className={`${isActive('/')} font-medium py-2`}>
                Products
              </Link>
              <Link href="/orders" className={`${isActive('/orders')} font-medium py-2`}>
                Place Order
              </Link>
              <Link href="/track-order" className={`${isActive('/track-order')} font-medium py-2`}>
                Track Order
              </Link>
              <Link href="/admin" className={`${isActive('/admin')} font-medium py-2`}>
                Admin
              </Link>
            </nav>

            <div className="md:hidden">
              {/* Mobile menu button would go here */}
              <button className="text-gray-500 hover:text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Harvest Hub</h3>
              <p className="text-gray-300">Your trusted source for fresh, bulk produce.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-white">Products</Link></li>
                <li><Link href="/orders" className="text-gray-300 hover:text-white">Place Order</Link></li>
                <li><Link href="/track-order" className="text-gray-300 hover:text-white">Track Order</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-300">Email: info@harvesthub.com</p>
              <p className="text-gray-300">Phone: (555) 123-4567</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Harvest Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
