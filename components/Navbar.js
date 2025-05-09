import { useState } from 'react';
import Link from 'next/link';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';

export default function MainNavbar({ cartItemCount = 0 }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar 
      bg="light" 
      expand="lg" 
      sticky="top" 
      className="shadow-sm mb-3"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img 
            src="/logo.svg" 
            alt="Harvest Hub Logo" 
            width="30" 
            height="30" 
            className="d-inline-block me-2" 
          />
          <span className="fw-bold text-success">Harvest Hub</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/" onClick={() => setExpanded(false)}>Home</Nav.Link>
            <Nav.Link href="/products" onClick={() => setExpanded(false)}>Products</Nav.Link>
            <Nav.Link href="/orders" onClick={() => setExpanded(false)}>
              <i className="bi bi-clipboard me-1"></i>
              Orders
            </Nav.Link>
            <Nav.Link href="/cart" onClick={() => setExpanded(false)}>
              <i className="bi bi-cart me-1"></i>
              Cart
              {cartItemCount > 0 && (
                <Badge pill bg="success" className="ms-1">
                  {cartItemCount}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link href="/login" onClick={() => setExpanded(false)}>
              <i className="bi bi-person me-1"></i>
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}