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
          <h1 className="mb-4">Your Cart</h1>
          <Card className="shadow-sm">
            <Card.Body className="text-center py-5">
              <i className="bi bi-cart3 fs-1 text-muted mb-3"></i>
              <h3>Your cart is empty</h3>
              <p className="text-muted">Looks like you haven't added any products to your cart yet.</p>
              <Link href="/">
                <Button variant="success" className="mt-3">
                  Browse Products
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout title="Shopping Cart">
      <Container>
        <h1 className="mb-4">Your Cart</h1>
        
        <Row>
          <Col lg={8}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Table responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-center">Subtotal</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.productId}>
                        <td>
                          <div className="d-flex align-items-center">
                            {item.product?.imageUrl && (
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name} 
                                className="me-3" 
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} 
                              />
                            )}
                            <div>
                              <h6 className="mb-0">{item.product?.name || 'Product'}</h6>
                              <small className="text-muted">{item.product?.category || 'Category'}</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-center align-middle">
                          ${item.product?.price.toFixed(2) || '0.00'}
                        </td>
                        <td className="text-center align-middle">
                          <InputGroup size="sm" style={{ maxWidth: '120px', margin: '0 auto' }}>
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <i className="bi bi-dash"></i>
                            </Button>
                            <Form.Control 
                              type="number" 
                              value={item.quantity} 
                              min="1"
                              onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                              className="text-center"
                            />
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </Button>
                          </InputGroup>
                        </td>
                        <td className="text-center align-middle fw-bold">
                          ${calculateSubtotal(item).toFixed(2)}
                        </td>
                        <td className="text-center align-middle">
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            
            <div className="d-flex justify-content-between mb-4">
              <Link href="/">
                <Button variant="outline-secondary">
                  <i className="bi bi-arrow-left me-2"></i>
                  Continue Shopping
                </Button>
              </Link>
              <Button variant="outline-success" onClick={() => {
                localStorage.setItem('cart', JSON.stringify([]));
                setCart([]);
                const event = new Event('cartUpdated');
                window.dispatchEvent(event);
              }}>
                <i className="bi bi-trash me-2"></i>
                Clear Cart
              </Button>
            </div>
          </Col>
          
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Header as="h5">Order Summary</Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>$0.00</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3 fw-bold">
                  <span>Total:</span>
                  <span className="text-success">${calculateTotal().toFixed(2)}</span>
                </div>
                
                <Link href="/checkout">
                  <Button variant="success" className="w-100">
                    Proceed to Checkout
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}