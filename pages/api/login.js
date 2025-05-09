import prisma from '../../lib/prisma';
import { compare } from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
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

    // Create session (simplified for now - in a real app you'd use NextAuth.js or a proper session system)
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
    
    res.status(200).json(userData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}