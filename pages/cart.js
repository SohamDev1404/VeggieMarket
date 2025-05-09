import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup } from 'react-bootstrap';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load cart data on client-side
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (storedCart.length > 0) {
      // Fetch full product details for all products in cart
      fetchProductDetails(storedCart).then(enrichedCart => {
        setCart(enrichedCart);
        setLoading(false);
      });
    } else {
      setCart([]);
      setLoading(false);
    }
  }, []);
  
  // Fetch product details for all cart items
  const fetchProductDetails = async (cartItems) => {
    try {
      const productIds = cartItems.map(item => item.productId);
      const response = await fetch('/api/products');
      const products = await response.json();
      
      // Enrich cart items with product details
      return cartItems.map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        return {
          ...cartItem,
          product
        };
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
      return cartItems;
    }
  };
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch custom event to update cart count in header
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
  };
  
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch custom event to update cart count in header
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
  };
  
  const calculateSubtotal = (item) => {
    return item.product?.price * item.quantity || 0;
  };
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + calculateSubtotal(item), 0);
  };
  
  if (loading) {
    return (
      <Layout title="Shopping Cart">
        <Container>
          <h1 className="mb-4">Your Cart</h1>
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </Layout>
    );
  }
  
  if (cart.length === 0) {
    return (
      <Layout title="Shopping Cart">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">Your Cart</h1>
            <span className="badge bg-secondary rounded-pill fs-6">0 items</span>
          </div>
          
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                  <div className="empty-cart-icon bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '120px', height: '120px' }}>
                    <i className="bi bi-cart3 fs-1 text-success"></i>
                  </div>
                  <h3 className="mb-3">Your cart is empty</h3>
                  <p className="text-muted mb-4">
                    Looks like you haven't added any products to your cart yet.<br />
                    Browse our selection of fresh products and start shopping!
                  </p>
                  <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                    <Link href="/products">
                      <Button variant="success" size="lg">
                        <i className="bi bi-bag me-2"></i>
                        Browse Products
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline-secondary" size="lg">
                        <i className="bi bi-house me-2"></i>
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
              
              <div className="mt-5">
                <h5 className="text-center mb-4">You might be interested in</h5>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <Card className="featured-product shadow-sm" style={{ width: '180px' }}>
                    <Card.Img variant="top" src="https://images.unsplash.com/photo-1518977881905-4b3f1b7bb250?q=80&w=1470&auto=format&fit=crop" style={{ height: '120px', objectFit: 'cover' }} />
                    <Card.Body className="p-2 text-center">
                      <Card.Title className="fs-6 mb-1">Fresh Vegetables</Card.Title>
                      <Link href="/products?category=vegetable">
                        <Button variant="outline-success" size="sm" className="w-100">View Products</Button>
                      </Link>
                    </Card.Body>
                  </Card>
                  
                  <Card className="featured-product shadow-sm" style={{ width: '180px' }}>
                    <Card.Img variant="top" src="https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?q=80&w=1470&auto=format&fit=crop" style={{ height: '120px', objectFit: 'cover' }} />
                    <Card.Body className="p-2 text-center">
                      <Card.Title className="fs-6 mb-1">Organic Fruits</Card.Title>
                      <Link href="/products?category=fruit">
                        <Button variant="outline-success" size="sm" className="w-100">View Products</Button>
                      </Link>
                    </Card.Body>
                  </Card>
                  
                  <Card className="featured-product shadow-sm" style={{ width: '180px' }}>
                    <Card.Img variant="top" src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1470&auto=format&fit=crop" style={{ height: '120px', objectFit: 'cover' }} />
                    <Card.Body className="p-2 text-center">
                      <Card.Title className="fs-6 mb-1">Fresh Herbs</Card.Title>
                      <Link href="/products?category=herb">
                        <Button variant="outline-success" size="sm" className="w-100">View Products</Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout title="Shopping Cart">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Your Cart</h1>
          <span className="badge bg-success rounded-pill fs-6">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
        </div>
        
        <Row>
          <Col lg={8}>
            <Card className="shadow-sm mb-4 border-0">
              <Card.Body className="p-0">
                {cart.map((item, index) => (
                  <div key={item.productId} className={`cart-item p-3 ${index < cart.length - 1 ? 'border-bottom' : ''}`}>
                    <div className="d-flex align-items-center">
                      <div className="cart-item-image me-3">
                        {item.product?.imageUrl ? (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="rounded" 
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                          />
                        ) : (
                          <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                            <i className="bi bi-image text-muted fs-4"></i>
                          </div>
                        )}
                      </div>
                      
                      <div className="cart-item-details flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h5 className="mb-0">{item.product?.name || 'Product'}</h5>
                            <div className="text-muted small">
                              <span className="badge bg-light text-dark me-2">
                                {item.product?.category || 'Category'}
                              </span>
                              {item.product?.unit && (
                                <span>${item.product.price.toFixed(2)} / {item.product.unit}</span>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="link" 
                            className="text-danger p-0" 
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <i className="bi bi-x-circle"></i>
                          </Button>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="quantity-controls d-flex align-items-center">
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              className="rounded-circle p-1"
                              style={{ width: '32px', height: '32px' }}
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <i className="bi bi-dash"></i>
                            </Button>
                            <span className="mx-3">{item.quantity}</span>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              className="rounded-circle p-1"
                              style={{ width: '32px', height: '32px' }}
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </Button>
                          </div>
                          
                          <div className="subtotal text-end">
                            <span className="text-muted me-2">Subtotal:</span>
                            <span className="fw-bold text-success fs-5">
                              ${calculateSubtotal(item).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
              <Card.Footer className="bg-white d-flex justify-content-between py-3">
                <Link href="/products">
                  <Button variant="outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Continue Shopping
                  </Button>
                </Link>
                <Button 
                  variant="outline-danger" 
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                      localStorage.setItem('cart', JSON.stringify([]));
                      setCart([]);
                      const event = new Event('cartUpdated');
                      window.dispatchEvent(event);
                    }
                  }}
                >
                  <i className="bi bi-trash me-2"></i>
                  Clear Cart
                </Button>
              </Card.Footer>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                  <span className="fw-bold">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping:</span>
                  <span className="fw-bold text-success">Free</span>
                </div>
                {calculateTotal() > 100 && (
                  <div className="alert alert-success py-2 small mb-3">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    You've qualified for free shipping!
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold fs-5">Total:</span>
                  <span className="fw-bold text-success fs-4">${calculateTotal().toFixed(2)}</span>
                </div>
                
                <Link href="/checkout">
                  <Button 
                    variant="success" 
                    size="lg" 
                    className="w-100 mb-3"
                    disabled={cart.length === 0}
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <div className="text-center text-muted small">
                  <p className="mb-1">Secure Checkout</p>
                  <div>
                    <i className="bi bi-lock-fill me-2"></i>
                    <i className="bi bi-credit-card me-2"></i>
                    <i className="bi bi-truck me-2"></i>
                    <i className="bi bi-shield-check"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6>Need Help?</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-question-circle text-success me-2"></i>
                    Shipping &amp; Delivery
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-arrow-return-left text-success me-2"></i>
                    Returns &amp; Refunds
                  </li>
                  <li>
                    <i className="bi bi-envelope text-success me-2"></i>
                    Contact Support
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}