import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all services
router.get('/', authenticate, async (req, res) => {
  try {
    const services = await prisma.services.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({
      data: services,
      message: 'Services retrieved successfully'
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve services',
      status: 500
    });
  }
});

// Get single service
router.get('/:id', authenticate, async (req, res) => {
  try {
    const service = await prisma.services.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!service) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Service not found',
        status: 404
      });
    }

    res.json({
      data: service,
      message: 'Service retrieved successfully'
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve service',
      status: 500
    });
  }
});

// Create service
router.post('/', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const { name, category, description, price } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name and category are required',
        status: 400
      });
    }

    const service = await prisma.services.create({
      data: {
        name,
        category,
        description,
        price: price ? parseFloat(price) : null
      }
    });

    res.status(201).json({
      data: service,
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create service',
      status: 500
    });
  }
});

// Update service
router.put('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const service = await prisma.services.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!service) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Service not found',
        status: 404
      });
    }

    const { name, category, description, price, status } = req.body;

    // Only include fields that are provided
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description || null;
    if (price !== undefined) updateData.price = price ? parseFloat(price) : null;
    if (status !== undefined) updateData.status = status;

    const updatedService = await prisma.services.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });

    res.json({
      data: updatedService,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update service',
      status: 500
    });
  }
});

// Delete service
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const service = await prisma.services.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!service) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Service not found',
        status: 404
      });
    }

    await prisma.services.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete service',
      status: 500
    });
  }
});

export default router;

