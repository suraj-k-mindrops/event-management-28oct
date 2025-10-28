import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all events
router.get('/', authenticate, async (req, res) => {
  try {
    const events = await prisma.events.findMany({
      include: {
        event_types: true,
        venues: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json({
      data: events,
      message: 'Events retrieved successfully'
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve events',
      status: 500
    });
  }
});

// Get single event
router.get('/:id', authenticate, async (req, res) => {
  try {
    const event = await prisma.events.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        event_types: true,
        venues: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Event not found',
        status: 404
      });
    }

    res.json({
      data: event,
      message: 'Event retrieved successfully'
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve event',
      status: 500
    });
  }
});

// Create event
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, date, description, eventTypeId, venueId, capacity, price } = req.body;

    // Validation
    if (!name || !date) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name and date are required',
        status: 400
      });
    }

    const event = await prisma.events.create({
      data: {
        name,
        date: new Date(date),
        description,
        event_type_id: eventTypeId ? parseInt(eventTypeId) : null,
        venue_id: venueId ? parseInt(venueId) : null,
        organizer_id: req.user.id,
        capacity: capacity ? parseInt(capacity) : null,
        price: price ? parseFloat(price) : null,
        status: 'DRAFT'
      }
    });

    res.status(201).json({
      data: event,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create event',
      status: 500
    });
  }
});

// Update event
router.put('/:id', authenticate, async (req, res) => {
  try {
    const event = await prisma.events.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!event) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Event not found',
        status: 404
      });
    }

    // Check if user is the organizer or admin
    if (event.organizer_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update this event',
        status: 403
      });
    }

    const { name, date, description, eventTypeId, venueId, status, capacity, price } = req.body;

    // Only include fields that are provided
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (date !== undefined) updateData.date = new Date(date);
    if (description !== undefined) updateData.description = description;
    if (eventTypeId !== undefined) updateData.event_type_id = eventTypeId ? parseInt(eventTypeId) : null;
    if (venueId !== undefined) updateData.venue_id = venueId ? parseInt(venueId) : null;
    if (status !== undefined) updateData.status = status;
    if (capacity !== undefined) updateData.capacity = capacity ? parseInt(capacity) : null;
    if (price !== undefined) updateData.price = price ? parseFloat(price) : null;

    const updatedEvent = await prisma.events.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
      include: {
        event_types: true,
        venues: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      data: updatedEvent,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update event',
      status: 500
    });
  }
});

// Delete event
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const event = await prisma.events.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!event) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Event not found',
        status: 404
      });
    }

    // Check if user is the organizer or admin
    if (event.organizer_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to delete this event',
        status: 403
      });
    }

    await prisma.events.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete event',
      status: 500
    });
  }
});

export default router;

