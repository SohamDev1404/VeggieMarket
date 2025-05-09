import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Registration specific validations
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setServerError('');
    
    try {
      const action = isLogin ? 'login' : 'register';
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }
      
      // Successful login/registration
      router.push('/');
      
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setServerError('');
  };

  return (
    <Layout title={isLogin ? 'Login' : 'Register'}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Create Account'}</h2>
                
                {serverError && (
                  <Alert variant="danger">{serverError}</Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}
                  
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  {!isLogin && (
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}
                  
                  <Button 
                    variant="success" 
                    type="submit" 
                    className="w-100 mt-3" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isLogin ? 'Logging in...' : 'Creating account...'}
                      </>
                    ) : (
                      <>{isLogin ? 'Login' : 'Register'}</>
                    )}
                  </Button>
                </Form>
                
                <div className="mt-3 text-center">
                  <p>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <Button 
                      variant="link" 
                      className="p-0" 
                      onClick={toggleForm}
                    >
                      {isLogin ? 'Register here' : 'Login here'}
                    </Button>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} className="d-none d-md-block">
            <div className="h-100 d-flex flex-column justify-content-center p-4">
              <h2 className="text-success mb-3">Welcome to Harvest Hub</h2>
              <p className="lead">Your source for fresh, bulk produce direct from farmers.</p>
              <ul className="list-unstyled mt-4">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Access bulk ordering for your business
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Track your orders in real-time
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Get fresh produce delivered directly to you
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Support local farmers and sustainable agriculture
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}