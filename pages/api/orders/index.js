import prisma from '../../../lib/prisma';
import { isValidStatus } from '../../../utils/statusHelper';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getOrders(req, res);
    case 'POST':
      return createOrder(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// GET - Get all orders
async function getOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
}

// POST - Create a new order
async function createOrder(req, res) {
  try {
    const { customerName, contactNumber, address, items, status } = req.body;
    
    // Validate required fields
    if (!customerName || !contactNumber || !address) {
      return res.status(400).json({ message: 'Customer name, contact, and address are required' });
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Validate status if provided
    if (status && !isValidStatus(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }
    
    // Validate products existence and create order items
    const productIds = items.map(item => item.productId);
    
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    
    if (products.length !== productIds.length) {
      return res.status(400).json({ message: 'One or more products do not exist' });
    }
    
    // Create the order and order items in a transaction
    const order = await prisma.order.create({
      data: {
        customerName,
        contactNumber,
        address,
        status: status || 'Pending',
        orderItems: {
          create: items.map(item => ({
            quantity: item.quantity,
            product: {
              connect: {
                id: item.productId,
              },
            },
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    
    return res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Failed to create order' });
  }
}
