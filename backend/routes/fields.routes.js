import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all fields
router.get('/', authenticate, async (req, res) => {
  try {
    const fields = await prisma.field.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      data: fields,
      message: 'Fields retrieved successfully'
    });
  } catch (error) {
    console.error('Get fields error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve fields',
      status: 500
    });
  }
});

// Get single field
router.get('/:id', authenticate, async (req, res) => {
  try {
    const field = await prisma.field.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!field) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Field not found',
        status: 404
      });
    }

    res.json({
      data: field,
      message: 'Field retrieved successfully'
    });
  } catch (error) {
    console.error('Get field error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve field',
      status: 500
    });
  }
});

// Create field
router.post('/', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const { name, capacity, location, status, description, amenities } = req.body;

    if (!name || !capacity || !location) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name, capacity, and location are required',
        status: 400
      });
    }

    const field = await prisma.field.create({
      data: {
        name,
        capacity: parseInt(capacity),
        location,
        status: status || 'ACTIVE',
        description,
        amenities: amenities ? JSON.parse(JSON.stringify(amenities)) : null
      }
    });

    res.status(201).json({
      data: field,
      message: 'Field created successfully'
    });
  } catch (error) {
    console.error('Create field error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create field',
      status: 500
    });
  }
});

// Update field
router.put('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const field = await prisma.field.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!field) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Field not found',
        status: 404
      });
    }

    const { name, capacity, location, status, description, amenities } = req.body;

    const updatedField = await prisma.field.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        capacity: capacity ? parseInt(capacity) : undefined,
        location,
        status,
        description,
        amenities: amenities ? JSON.parse(JSON.stringify(amenities)) : undefined
      }
    });

    res.json({
      data: updatedField,
      message: 'Field updated successfully'
    });
  } catch (error) {
    console.error('Update field error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update field',
      status: 500
    });
  }
});

// Delete field
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const field = await prisma.field.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!field) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Field not found',
        status: 404
      });
    }

    await prisma.field.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({
      message: 'Field deleted successfully'
    });
  } catch (error) {
    console.error('Delete field error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete field',
      status: 500
    });
  }
});

export default router;

