import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  const productId = parseInt(id);
  
  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  switch (req.method) {
    case 'GET':
      return getProduct(req, res, productId);
    case 'PUT':
      return updateProduct(req, res, productId);
    case 'DELETE':
      return deleteProduct(req, res, productId);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// GET - Get a specific product
async function getProduct(req, res, productId) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ message: 'Failed to fetch product' });
  }
}

// PUT - Update a product
async function updateProduct(req, res, productId) {
  try {
    const { name, description, price, category, imageUrl } = req.body;
    
    // Validate required fields
    if (!name || price === undefined || price === null || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        category,
        imageUrl: imageUrl || null,
      },
    });
    
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Failed to update product' });
  }
}

// DELETE - Delete a product
async function deleteProduct(req, res, productId) {
  try {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product is used in any orders
    const orderItems = await prisma.orderItem.findFirst({
      where: { productId },
    });
    
    if (orderItems) {
      return res.status(400).json({ 
        message: 'Cannot delete product as it is associated with existing orders' 
      });
    }
    
    // Delete the product
    await prisma.product.delete({
      where: { id: productId },
    });
    
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Failed to delete product' });
  }
}
