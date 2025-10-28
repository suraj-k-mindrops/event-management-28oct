import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all event types
router.get('/', authenticate, async (req, res) => {
  try {
    const eventTypes = await prisma.event_types.findMany({
      include: {
        _count: {
          select: { events: true }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const eventTypesWithCount = eventTypes.map(et => ({
      ...et,
      events: et._count.events
    }));

    res.json({
      data: eventTypesWithCount,
      message: 'Event types retrieved successfully'
    });
  } catch (error) {
    console.error('Get event types error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve event types',
      status: 500
    });
  }
});

// Get single event type
router.get('/:id', authenticate, async (req, res) => {
  try {
    const eventType = await prisma.event_types.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        _count: {
          select: { events: true }
        }
      }
    });

    if (!eventType) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Event type not found',
        status: 404
      });
    }

    res.json({
      data: { ...eventType, events: eventType._count.events },
      message: 'Event type retrieved successfully'
    });
  } catch (error) {
    console.error('Get event type error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve event type',
      status: 500
    });
  }
});

// Create event type
router.post('/', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const { name, color, description, category, subEvents } = req.body;

    if (!name || !color) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name and color are required',
        status: 400
      });
    }

    const eventType = await prisma.event_types.create({
      data: {
        name,
        color,
        description,
        category,
        subEvents: subEvents && subEvents.length > 0 ? subEvents : null
      }
    });

    res.status(201).json({
      data: { ...eventType, events: 0 },
      message: 'Event type created successfully'
    });
  } catch (error) {
    console.error('Create event type error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create event type',
      status: 500
    });
  }
});

// Update event type
router.put('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const eventType = await prisma.event_types.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!eventType) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Event type not found',
        status: 404
      });
    }

    const { name, color, description, category, subEvents, active } = req.body;
    
    console.log('Updating event type with subEvents:', subEvents);

    const updatedEventType = await prisma.event_types.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        color,
        description,
        category,
        subEvents: subEvents && subEvents.length > 0 ? subEvents : null,
        active
      },
      include: {
        _count: {
          select: { events: true }
        }
      }
    });

    res.json({
      data: { ...updatedEventType, events: updatedEventType._count.events },
      message: 'Event type updated successfully'
    });
  } catch (error) {
    console.error('Update event type error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update event type',
      status: 500
    });
  }
});

// Delete event type
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const eventType = await prisma.event_types.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!eventType) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Event type not found',
        status: 404
      });
    }

    await prisma.event_types.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({
      message: 'Event type deleted successfully'
    });
  } catch (error) {
    console.error('Delete event type error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete event type',
      status: 500
    });
  }
});

export default router;

