import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminNav() {
  const router = useRouter();
  
  const isActive = (path) => {
    return router.pathname === path ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100';
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-100">
        <h2 className="font-bold text-lg text-gray-800">Admin Dashboard</h2>
      </div>
      <nav className="p-2">
        <ul>
          <li>
            <Link href="/admin" className={`block px-4 py-2 rounded ${isActive('/admin')}`}>
              Order Management
            </Link>
          </li>
          <li>
            <Link href="/admin/inventory" className={`block px-4 py-2 rounded ${isActive('/admin/inventory')}`}>
              Inventory Management
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
