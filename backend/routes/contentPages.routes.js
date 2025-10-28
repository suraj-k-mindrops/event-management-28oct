import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all content pages
router.get('/', authenticate, async (req, res) => {
  try {
    const contentPages = await prisma.contentPage.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json({
      data: contentPages,
      message: 'Content pages retrieved successfully'
    });
  } catch (error) {
    console.error('Get content pages error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve content pages',
      status: 500
    });
  }
});

// Get single content page
router.get('/:id', authenticate, async (req, res) => {
  try {
    const contentPage = await prisma.contentPage.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!contentPage) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Content page not found',
        status: 404
      });
    }

    res.json({
      data: contentPage,
      message: 'Content page retrieved successfully'
    });
  } catch (error) {
    console.error('Get content page error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve content page',
      status: 500
    });
  }
});

// Create content page
router.post('/', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const { title, content, status, slug } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Title and content are required',
        status: 400
    });
  }

    if (!slug) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Slug is required',
        status: 400
      });
    }

    const contentPage = await prisma.contentPage.create({
      data: {
        title,
        content,
        status: status || 'DRAFT',
        slug
      }
    });

    res.status(201).json({
      data: contentPage,
      message: 'Content page created successfully'
    });
  } catch (error) {
    console.error('Create content page error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.code === 'P2002' ? 'Slug already exists' : 'Failed to create content page',
      status: 500
    });
  }
});

// Update content page
router.put('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const contentPage = await prisma.contentPage.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!contentPage) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Content page not found',
        status: 404
      });
    }

    const { title, content, status, slug } = req.body;

    const updatedContentPage = await prisma.contentPage.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        content,
        status,
        slug
      }
    });

    res.json({
      data: updatedContentPage,
      message: 'Content page updated successfully'
    });
  } catch (error) {
    console.error('Update content page error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update content page',
      status: 500
    });
  }
});

// Delete content page
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const contentPage = await prisma.contentPage.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!contentPage) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Content page not found',
        status: 404
      });
    }

    await prisma.contentPage.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({
      message: 'Content page deleted successfully'
    });
  } catch (error) {
    console.error('Delete content page error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete content page',
      status: 500
    });
  }
});

export default router;

