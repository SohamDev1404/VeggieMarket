import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Container, Row, Col, Card, Button, Carousel, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';

// Function to add products to cart
const addToCart = (product, quantity) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Check if product already exists in cart
  const existingItemIndex = cart.findIndex(item => item.productId === product.id);
  
  if (existingItemIndex >= 0) {
    // Update quantity if product exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item if product doesn't exist
    cart.push({
      productId: product.id,
      quantity: quantity
    });
  }
  
  // Save updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Dispatch custom event to update cart count in header
  const event = new Event('cartUpdated');
  window.dispatchEvent(event);
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        
        // Initialize quantities state
        const initialQuantities = {};
        data.forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category))];
  
  // Filter products by selected category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);
  
  // Update quantity for specific product
  const updateQuantity = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  return (
    <Layout title="Home">
      {/* Hero Section with Carousel */}
      <Carousel className="mb-5 shadow">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80"
            alt="Fresh vegetables"
            style={{height: "400px", objectFit: "cover"}}
          />
          <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3">
            <h2>Fresh Produce for Bulk Orders</h2>
            <p>Quality vegetables sourced directly from local farms for your business needs.</p>
            <Button variant="success">Browse Vegetables</Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80"
            alt="Fresh fruits"
            style={{height: "400px", objectFit: "cover"}}
          />
          <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3">
            <h2>Seasonal Fruits</h2>
            <p>Farm-fresh fruits available for bulk purchase at wholesale prices.</p>
            <Button variant="warning" className="text-white">Browse Fruits</Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Products Section */}
      <Container className="mb-5">
        <h2 className="text-center mb-4">Our Products</h2>
        
        {/* Category Filter */}
        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group">
            {categories.map(category => (
              <Button 
                key={category} 
                variant={selectedCategory === category ? "success" : "outline-success"}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-2">Loading products...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : filteredProducts.length === 0 ? (
          <Alert variant="info">No products found in this category.</Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.id}>
                <Card className="h-100 shadow-sm hover-shadow transition">
                  <Card.Img 
                    variant="top" 
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&h=300&auto=format&fit=crop'} 
                    alt={product.name}
                    style={{height: "200px", objectFit: "cover"}}
                  />
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{product.category}</Card.Subtitle>
                      </div>
                      <span className="badge bg-success rounded-pill">${product.price.toFixed(2)}/kg</span>
                    </div>
                    <Card.Text className="text-muted small">{product.description}</Card.Text>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <InputGroup size="sm" style={{width: "120px"}}>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => updateQuantity(product.id, Math.max(1, quantities[product.id] - 1))}
                        >
                          <i className="bi bi-dash"></i>
                        </Button>
                        <Form.Control 
                          type="number" 
                          min="1" 
                          value={quantities[product.id] || 1} 
                          onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                          className="text-center"
                        />
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => updateQuantity(product.id, quantities[product.id] + 1)}
                        >
                          <i className="bi bi-plus"></i>
                        </Button>
                      </InputGroup>
                      <Button 
                        variant="success" 
                        onClick={() => addToCart(product, quantities[product.id])}
                      >
                        <i className="bi bi-cart-plus me-1"></i>
                        Add
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Features Section */}
      <div className="bg-light py-5 mb-5">
        <Container>
          <h2 className="text-center mb-4">Why Choose Harvest Hub?</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-flower2 fs-1 text-success"></i>
                  </div>
                  <Card.Title className="fs-4">Fresh Quality</Card.Title>
                  <Card.Text>
                    All products sourced directly from local farms, ensuring freshness and quality.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-truck fs-1 text-success"></i>
                  </div>
                  <Card.Title className="fs-4">Fast Delivery</Card.Title>
                  <Card.Text>
                    Reliable delivery service to ensure your produce arrives on time and in perfect condition.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-check-circle fs-1 text-success"></i>
                  </div>
                  <Card.Title className="fs-4">Bulk Pricing</Card.Title>
                  <Card.Text>
                    Competitive wholesale prices for restaurants, grocery stores, and businesses.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
}
