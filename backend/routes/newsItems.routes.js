import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all news items
router.get('/', authenticate, async (req, res) => {
  try {
    const newsItems = await prisma.newsItem.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    res.json({
      data: newsItems,
      message: 'News items retrieved successfully'
    });
  } catch (error) {
    console.error('Get news items error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve news items',
      status: 500
    });
  }
});

// Get single news item
router.get('/:id', authenticate, async (req, res) => {
  try {
    const newsItem = await prisma.newsItem.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!newsItem) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'News item not found',
        status: 404
      });
    }

    res.json({
      data: newsItem,
      message: 'News item retrieved successfully'
    });
  } catch (error) {
    console.error('Get news item error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve news item',
      status: 500
    });
  }
});

// Create news item
router.post('/', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const { title, content, status, date, author, tags, imageUrl } = req.body;

    if (!title || !content || !date) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Title, content, and date are required',
        status: 400
      });
    }

    const newsItem = await prisma.newsItem.create({
      data: {
        title,
        content,
        status: status || 'DRAFT',
        date: new Date(date),
        author,
        tags: tags ? JSON.parse(JSON.stringify(tags)) : null,
        imageUrl
      }
    });

    res.status(201).json({
      data: newsItem,
      message: 'News item created successfully'
    });
  } catch (error) {
    console.error('Create news item error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create news item',
      status: 500
    });
  }
});

// Update news item
router.put('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const newsItem = await prisma.newsItem.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!newsItem) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'News item not found',
        status: 404
      });
    }

    const { title, content, status, date, author, tags, imageUrl } = req.body;

    const updatedNewsItem = await prisma.newsItem.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        content,
        status,
        date: date ? new Date(date) : undefined,
        author,
        tags: tags ? JSON.parse(JSON.stringify(tags)) : undefined,
        imageUrl
      }
    });

    res.json({
      data: updatedNewsItem,
      message: 'News item updated successfully'
    });
  } catch (error) {
    console.error('Update news item error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update news item',
      status: 500
    });
  }
});

// Delete news item
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const newsItem = await prisma.newsItem.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!newsItem) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'News item not found',
        status: 404
      });
    }

    await prisma.newsItem.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({
      message: 'News item deleted successfully'
    });
  } catch (error) {
    console.error('Delete news item error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete news item',
      status: 500
    });
  }
});

export default router;

