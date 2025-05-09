import prisma from '../../lib/prisma';
import { hash } from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
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
    
    // Set session in a cookie
    res.setHeader('Set-Cookie', `session=${JSON.stringify(session)}; Path=/; HttpOnly; Max-Age=3600; SameSite=Strict`);
    
    res.status(201).json(userData);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}