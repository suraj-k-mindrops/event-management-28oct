import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all media items
router.get('/', authenticate, async (req, res) => {
  try {
    const mediaItems = await prisma.mediaItem.findMany({
      orderBy: {
        uploaded: 'desc'
      }
    });

    res.json({
      data: mediaItems,
      message: 'Media items retrieved successfully'
    });
  } catch (error) {
    console.error('Get media items error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve media items',
      status: 500
    });
  }
});

// Get single media item
router.get('/:id', authenticate, async (req, res) => {
  try {
    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!mediaItem) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Media item not found',
        status: 404
      });
    }

    res.json({
      data: mediaItem,
      message: 'Media item retrieved successfully'
    });
  } catch (error) {
    console.error('Get media item error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve media item',
      status: 500
    });
  }
});

// Create media item
router.post('/', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const { name, type, size, url } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name and type are required',
        status: 400
      });
    }

    const mediaItem = await prisma.mediaItem.create({
      data: {
        name,
        type,
        size,
        url
      }
    });

    res.status(201).json({
      data: mediaItem,
      message: 'Media item created successfully'
    });
  } catch (error) {
    console.error('Create media item error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create media item',
      status: 500
    });
  }
});

// Update media item
router.put('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!mediaItem) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Media item not found',
        status: 404
      });
    }

    const { name, type, size, url } = req.body;

    const updatedMediaItem = await prisma.mediaItem.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        type,
        size,
        url
      }
    });

    res.json({
      data: updatedMediaItem,
      message: 'Media item updated successfully'
    });
  } catch (error) {
    console.error('Update media item error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update media item',
      status: 500
    });
  }
});

// Delete media item
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!mediaItem) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Media item not found',
        status: 404
      });
    }

    await prisma.mediaItem.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({
      message: 'Media item deleted successfully'
    });
  } catch (error) {
    console.error('Delete media item error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete media item',
      status: 500
    });
  }
});

export default router;

