import Head from 'next/head';
import MainNavbar from './Navbar';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export default function Layout({ children, title = 'Harvest Hub' }) {
  const [cartCount, setCartCount] = useState(0);
  
  // Get cart items from localStorage on client-side
  useEffect(() => {
    const getCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };
    
    getCartCount();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', getCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', getCartCount);
    };
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Head>
        <title>{`${title} | Bulk Vegetable & Fruit Orders`}</title>
        <meta name="description" content="Order fresh vegetables and fruits in bulk" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <MainNavbar cartItemCount={cartCount} />
      
      <main className="flex-grow-1 py-3">
        <Container>
          {children}
        </Container>
      </main>
      
      <footer className="bg-light mt-auto border-top py-4">
        <Container>
          <Row>
            <Col md={4} className="mb-3 mb-md-0">
              <h5 className="text-success">Harvest Hub</h5>
              <p className="text-muted">Fresh produce for bulk orders, directly from farmers to your business.</p>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="/" className="text-decoration-none">Home</a></li>
                <li><a href="/products" className="text-decoration-none">Products</a></li>
                <li><a href="/orders" className="text-decoration-none">Orders</a></li>
                <li><a href="/login" className="text-decoration-none">Login</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Contact</h5>
              <address className="text-muted">
                <p>123 Farmer's Road<br />Harvest Valley, CA 94123</p>
                <p>Email: info@harvesthub.com<br />Phone: (555) 123-4567</p>
              </address>
            </Col>
          </Row>
          <hr />
          <p className="text-center text-muted mb-0">© {new Date().getFullYear()} Harvest Hub. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}
