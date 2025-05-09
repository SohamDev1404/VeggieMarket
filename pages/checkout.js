import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Link from 'next/link';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    address: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);

  // Load cart data on client-side
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get cart from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (storedCart.length === 0) {
          // Redirect to cart page if cart is empty
          router.push('/cart');
          return;
        }
        
        // Get products data
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const productsData = await response.json();
        setProducts(productsData);
        
        // Enrich cart with product details
        const enrichedCart = storedCart.map(item => {
          const product = productsData.find(p => p.id === item.productId);
          return {
            ...item,
            product
          };
        });
        
        setCart(enrichedCart);
        setLoading(false);
      } catch (error) {
        console.error('Error loading checkout data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  // Calculate order totals
  const calculateSubtotal = (item) => {
    return item.product?.price * item.quantity || 0;
  };
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + calculateSubtotal(item), 0);
  };

  // Form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10,15}$/.test(formData.contactNumber.replace(/[^\d]/g, ''))) {
      newErrors.contactNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setOrderError('');
    
    try {
      // Prepare order items from cart
      const orderItems = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
      
      // Submit order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          contactNumber: formData.contactNumber,
          address: formData.address,
          notes: formData.notes,
          orderItems
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }
      
      // Handle success
      const orderData = await response.json();
      setOrderNumber(orderData.id);
      setOrderSuccess(true);
      
      // Clear cart
      localStorage.setItem('cart', JSON.stringify([]));
      
      // Dispatch event to update cart count in header
      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
      
    } catch (error) {
      console.error('Order submission error:', error);
      setOrderError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Checkout">
        <Container className="py-4">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading checkout information...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  // Success page after order is placed
  if (orderSuccess) {
    return (
      <Layout title="Order Confirmed">
        <Container className="py-5">
          <Card className="shadow-sm border-0">
            <Card.Body className="p-5 text-center">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
              </div>
              <h1 className="display-5 mb-3">Order Confirmed!</h1>
              <p className="lead mb-4">Thank you for your order. We've received your request and it's being processed.</p>
              
              <div className="mb-4">
                <h4>Order Number: #{orderNumber}</h4>
                <p className="text-muted">Please save this number for tracking your order.</p>
              </div>
              
              <Link href="/track-order">
                <Button variant="success" className="me-3">
                  <i className="bi bi-truck me-2"></i>
                  Track Your Order
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline-primary">
                  <i className="bi bi-house me-2"></i>
                  Return to Home
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout">
      <Container className="py-4">
        <h1 className="mb-4">Checkout</h1>
        
        {orderError && <Alert variant="danger">{orderError}</Alert>}
        
        <Row>
          <Col lg={7} className="mb-4 mb-lg-0">
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Customer Information</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      isInvalid={!!errors.customerName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.customerName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      isInvalid={!!errors.contactNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contactNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Delivery Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      isInvalid={!!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Additional Notes (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between mt-4">
                    <Link href="/cart">
                      <Button variant="outline-secondary">
                        <i className="bi bi-arrow-left me-2"></i>
                        Return to Cart
                      </Button>
                    </Link>
                    
                    <Button 
                      type="submit" 
                      variant="success" 
                      disabled={submitting || cart.length === 0}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        <>Place Order</>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={5}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                {cart.map(item => (
                  <div key={item.productId} className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <div 
                        className="bg-light rounded me-3" 
                        style={{ width: "50px", height: "50px", overflow: "hidden" }}
                      >
                        {item.product?.imageUrl ? (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="img-fluid" 
                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <i className="bi bi-image text-muted"></i>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="mb-0 fw-medium">{item.product?.name}</p>
                        <small className="text-muted">{item.quantity} x ${item.product?.price.toFixed(2)}</small>
                      </div>
                    </div>
                    <div className="fw-bold">${calculateSubtotal(item).toFixed(2)}</div>
                  </div>
                ))}
                
                <hr/>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>$0.00</span>
                </div>
                
                <hr className="mb-2"/>
                
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span className="text-success fs-5">${calculateTotal().toFixed(2)}</span>
                </div>
              </Card.Body>
            </Card>
            
            <Card className="bg-light border-0">
              <Card.Body>
                <h6><i className="bi bi-info-circle me-2"></i>Important Information</h6>
                <ul className="mb-0 small">
                  <li>Delivery typically takes 1-2 business days</li>
                  <li>Payment is collected upon delivery</li>
                  <li>You will receive order updates via SMS</li>
                  <li>Need help? Contact us at support@harvesthub.com</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}