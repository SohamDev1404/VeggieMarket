import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';
import AdminNav from '../../components/AdminNav';

export default function InventoryManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    reset(product);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      // Update local state
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  const onSubmit = async (data) => {
    // Convert price to number
    data.price = parseFloat(data.price);
    
    try {
      let res;
      
      if (editingProduct) {
        // Update existing product
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } else {
        // Create new product
        res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }

      if (!res.ok) {
        throw new Error('Failed to save product');
      }

      const savedProduct = await res.json();
      
      // Update local state
      if (editingProduct) {
        setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
      } else {
        setProducts([...products, savedProduct]);
      }

      // Reset form and state
      reset();
      setEditingProduct(null);
      setIsAdding(false);
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setIsAdding(false);
    reset();
  };

  return (
    <Layout title="Inventory Management">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminNav />
          </div>
          
          <div className="md:col-span-3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
                <h2 className="font-bold text-xl">Inventory Management</h2>
                {!isAdding && !editingProduct && (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="btn btn-primary text-sm"
                  >
                    Add New Product
                  </button>
                )}
              </div>
              
              {(isAdding || editingProduct) && (
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="form-label" htmlFor="name">
                          Product Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                          {...register("name", { required: "Product name is required" })}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                      </div>
                      
                      <div>
                        <label className="form-label" htmlFor="price">
                          Price Per Kg
                        </label>
                        <input
                          id="price"
                          type="number"
                          step="0.01"
                          className={`form-input ${errors.price ? 'border-red-500' : ''}`}
                          {...register("price", { 
                            required: "Price is required",
                            min: { value: 0.01, message: "Price must be greater than 0" } 
                          })}
                        />
                        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                      </div>
                      
                      <div>
                        <label className="form-label" htmlFor="category">
                          Category
                        </label>
                        <select
                          id="category"
                          className={`form-input ${errors.category ? 'border-red-500' : ''}`}
                          {...register("category", { required: "Category is required" })}
                        >
                          <option value="">Select category</option>
                          <option value="vegetable">Vegetable</option>
                          <option value="fruit">Fruit</option>
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                      </div>
                      
                      <div>
                        <label className="form-label" htmlFor="imageUrl">
                          Image URL (optional)
                        </label>
                        <input
                          id="imageUrl"
                          type="text"
                          className="form-input"
                          {...register("imageUrl")}
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label className="form-label" htmlFor="description">
                          Description (optional)
                        </label>
                        <textarea
                          id="description"
                          rows="3"
                          className="form-input"
                          {...register("description")}
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                  <p className="mt-2 text-gray-600">Loading products...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-600">
                  <p>{error}</p>
                  <button 
                    onClick={fetchProducts}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Try Again
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No products in inventory. Add your first product!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {product.imageUrl ? (
                                  <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    {product.category === 'vegetable' ? '🥬' : '🍎'}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                {product.description && (
                                  <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${product.price.toFixed(2)} / kg
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
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
