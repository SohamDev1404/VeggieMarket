import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cart, setCart] = useState([]);
  
  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
    
    // Get cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);
  
  // Extract unique categories from products
  const categories = [...new Set(products.map(product => product.category))];
  
  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });
  
  // Handle adding product to cart
  const addToCart = (product, quantity = 1) => {
    const updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const newQuantity = updatedCart[existingItemIndex].quantity + quantity;
      
      if (newQuantity <= 0) {
        // Remove item if quantity is zero or negative
        updatedCart.splice(existingItemIndex, 1);
      } else {
        // Update quantity if positive
        updatedCart[existingItemIndex].quantity = newQuantity;
      }
    } else if (quantity > 0) {
      // Only add new item if quantity is positive
      updatedCart.push({
        productId: product.id,
        quantity: quantity,
        product: {
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          unit: product.unit
        }
      });
    }
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch event to update cart count in header
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
  };
  
  if (isLoading) {
    return (
      <Layout title="Products">
        <Container className="py-5">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading products...</p>
          </div>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout title="Products">
      <div className="product-hero-banner text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">Fresh Harvest Products</h1>
          <p className="lead">Discover our selection of fresh, locally-sourced produce</p>
        </Container>
      </div>
      
      <Container className="py-4">
        {/* Search and Filter Section */}
        <Row className="mb-4">
          <Col md={7}>
            <InputGroup className="shadow-sm">
              <InputGroup.Text className="bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </InputGroup.Text>
              <Form.Control 
                placeholder="Search for vegetables, fruits, or herbs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0"
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x"></i>
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col md={5}>
            <Form.Select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="shadow-sm"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        
        {/* Category Pills */}
        <div className="d-flex flex-wrap mb-4">
          <Button 
            variant={categoryFilter === '' ? 'success' : 'outline-success'} 
            className="me-2 mb-2 rounded-pill"
            onClick={() => setCategoryFilter('')}
          >
            All Products
          </Button>
          {categories.map(category => (
            <Button 
              key={category} 
              variant={categoryFilter === category ? 'success' : 'outline-success'} 
              className="me-2 mb-2 rounded-pill"
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Results Count */}
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <p className="text-muted mb-0">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            {categoryFilter && ` in ${categoryFilter}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
          
          {(searchTerm || categoryFilter) && (
            <Button 
              variant="link" 
              className="text-decoration-none p-0" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
              }}
            >
              <i className="bi bi-x-circle me-1"></i>
              Clear All Filters
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5 bg-light rounded shadow-sm">
            <i className="bi bi-search fs-1 text-muted"></i>
            <h4 className="mt-3">No products found</h4>
            <p className="text-muted">Try adjusting your search or filter to find what you're looking for.</p>
            <Button 
              variant="success" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
              }}
            >
              View All Products
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {filteredProducts.map(product => (
              <Col key={product.id} lg={4} md={6} className="mb-2">
                <Card className="product-card h-100 border-0 shadow-sm hover-elevate">
                  <div className="product-image-container">
                    {product.imageUrl ? (
                      <Card.Img 
                        variant="top" 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="product-image"
                      />
                    ) : (
                      <div className="product-image-placeholder d-flex align-items-center justify-content-center bg-light">
                        <i className="bi bi-image text-muted" style={{ fontSize: '2rem' }}></i>
                      </div>
                    )}
                    {product.inStock <= 5 && product.inStock > 0 && (
                      <span className="badge bg-warning position-absolute top-0 end-0 m-2">
                        Low Stock
                      </span>
                    )}
                    {product.inStock === 0 && (
                      <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                        Out of Stock
                      </span>
                    )}
                    <span className="badge bg-success position-absolute top-0 start-0 m-2">
                      {product.category}
                    </span>
                  </div>
                  
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="mb-1 fw-bold">{product.name}</Card.Title>
                    <Card.Subtitle className="text-success fw-bold mb-2">
                      ${product.price.toFixed(2)}
                      <span className="text-muted fw-normal small"> / {product.unit}</span>
                    </Card.Subtitle>
                    <Card.Text className="text-muted small mb-3">
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description}
                    </Card.Text>
                    
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="text-muted small">
                          <i className="bi bi-box-seam me-1"></i>
                          {product.inStock > 20 ? 'In Stock' : 
                           product.inStock > 0 ? `Only ${product.inStock} left` : 
                           'Out of Stock'}
                        </div>
                        <div className="quantity-selector">
                          <Button 
                            size="sm" 
                            variant="outline-secondary" 
                            className="rounded-circle p-1"
                            onClick={() => {
                              const currentQty = cart.find(i => i.productId === product.id)?.quantity || 0;
                              addToCart(product, -1);
                            }}
                            disabled={!cart.find(i => i.productId === product.id)}
                          >
                            <i className="bi bi-dash"></i>
                          </Button>
                          <span className="mx-2">
                            {cart.find(i => i.productId === product.id)?.quantity || 0}
                          </span>
                          <Button 
                            size="sm" 
                            variant="outline-secondary" 
                            className="rounded-circle p-1"
                            onClick={() => addToCart(product, 1)}
                            disabled={product.inStock === 0}
                          >
                            <i className="bi bi-plus"></i>
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        variant="success" 
                        className="w-100" 
                        onClick={() => addToCart(product, 1)}
                        disabled={product.inStock === 0}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        {cart.find(i => i.productId === product.id) ? 'Add More' : 'Add to Cart'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </Layout>
  );
}