import prisma from '../../lib/prisma';
import { compare, hash } from 'bcrypt';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      return handlePost(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function handlePost(req, res) {
  const { action } = req.body;

  if (!action) {
    return res.status(400).json({ message: 'Action is required' });
  }

  switch (action) {
    case 'login':
      return handleLogin(req, res);
    case 'register':
      return handleRegister(req, res);
    case 'logout':
      return handleLogout(req, res);
    default:
      return res.status(400).json({ message: 'Invalid action' });
  }
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If no user found or password doesn't match
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create session
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    
    // Set session cookie
    res.setHeader('Set-Cookie', `session=${JSON.stringify(session)}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`);
    
    res.status(200).json(userData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleRegister(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER', // Default role for new registrations
      },
    });

    // Create session
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    
    // Set session cookie
    res.setHeader('Set-Cookie', `session=${JSON.stringify(session)}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`);
    
    res.status(201).json(userData);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleLogout(req, res) {
  // Clear the session cookie
  res.setHeader('Set-Cookie', 'session=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict');
  res.status(200).json({ message: 'Logged out successfully' });
}