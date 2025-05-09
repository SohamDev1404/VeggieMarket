import prisma from '../../../lib/prisma';
import { isValidStatus } from '../../../utils/statusHelper';

export default async function handler(req, res) {
  const { id } = req.query;
  const orderId = parseInt(id);
  
  if (isNaN(orderId)) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  switch (req.method) {
    case 'GET':
      return getOrder(req, res, orderId);
    case 'PUT':
      return updateOrderStatus(req, res, orderId);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// GET - Get a specific order
async function getOrder(req, res, orderId) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ message: 'Failed to fetch order' });
  }
}

// PUT - Update order status
async function updateOrderStatus(req, res, orderId) {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!status || !isValidStatus(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }
    
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });
    
    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    
    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ message: 'Failed to update order' });
  }
}
