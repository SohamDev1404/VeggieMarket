import { useState } from 'react';
import Link from 'next/link';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        <Link href="/" passHref legacyBehavior>
          <Navbar.Brand className="d-flex align-items-center">
            <img 
              src="/logo.svg" 
              alt="Harvest Hub Logo" 
              width="30" 
              height="30" 
              className="d-inline-block me-2" 
            />
            <span className="fw-bold text-success">Harvest Hub</span>
          </Navbar.Brand>
        </Link>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Link href="/" passHref legacyBehavior>
              <Nav.Link onClick={() => setExpanded(false)}>Home</Nav.Link>
            </Link>
            <Link href="/products" passHref legacyBehavior>
              <Nav.Link onClick={() => setExpanded(false)}>Products</Nav.Link>
            </Link>
            <Link href="/orders" passHref legacyBehavior>
              <Nav.Link onClick={() => setExpanded(false)}>
                <FontAwesomeIcon icon="clipboard-list" className="me-1" />
                Orders
              </Nav.Link>
            </Link>
            <Link href="/cart" passHref legacyBehavior>
              <Nav.Link onClick={() => setExpanded(false)}>
                <FontAwesomeIcon icon="shopping-cart" className="me-1" />
                Cart
                {cartItemCount > 0 && (
                  <Badge pill bg="success" className="ms-1">
                    {cartItemCount}
                  </Badge>
                )}
              </Nav.Link>
            </Link>
            <Link href="/login" passHref legacyBehavior>
              <Nav.Link onClick={() => setExpanded(false)}>
                <FontAwesomeIcon icon="user" className="me-1" />
                Login
              </Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}