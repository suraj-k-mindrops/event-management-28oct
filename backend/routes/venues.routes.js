import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all venues
router.get('/', async (req, res) => {
  try {
    const venues = await prisma.venues.findMany({
      include: {
        _count: {
          select: { events: true }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const venuesWithCount = venues.map(venue => ({
      ...venue,
      bookings: venue._count.events
    }));

    res.json({
      data: venuesWithCount,
      message: 'Venues retrieved successfully'
    });
  } catch (error) {
    console.error('Get venues error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve venues',
      status: 500
    });
  }
});

// Get single venue
router.get('/:id', async (req, res) => {
  try {
    const venue = await prisma.venues.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        _count: {
          select: { events: true }
        }
      }
    });

    if (!venue) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Venue not found',
        status: 404
      });
    }

    res.json({
      data: { ...venue, bookings: venue._count.events },
      message: 'Venue retrieved successfully'
    });
  } catch (error) {
    console.error('Get venue error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve venue',
      status: 500
    });
  }
});

// Create venue
router.post('/', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    console.log('=== VENUE CREATION REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);
    
    const {
      name, contact, address, location, capacity, description, amenities,
      venue_type, event_types_supported, sub_event_types_supported,
      total_area_sqft, parking_capacity, rooms_available, booking_status,
      latitude, longitude, email, website, date, status
    } = req.body;

    if (!name || !location || !capacity) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name, location, and capacity are required',
        status: 400
      });
    }

    // Normalize status to match enum (ACTIVE, MAINTENANCE, INACTIVE)
    let normalizedStatus = status || 'ACTIVE';
    if (typeof normalizedStatus === 'string') {
      normalizedStatus = normalizedStatus.toUpperCase();
      if (!['ACTIVE', 'MAINTENANCE', 'INACTIVE'].includes(normalizedStatus)) {
        normalizedStatus = 'ACTIVE'; // default
      }
    }

    console.log('Creating venue with data:', {
      name,
      location,
      capacity: parseInt(capacity),
      status: normalizedStatus
    });

    const venue = await prisma.venues.create({
      data: {
        name,
        contact: contact || null,
        address: address || null,
        location,
        capacity: parseInt(capacity),
        description: description || null,
        amenities: amenities || null,
        venue_type: venue_type || null,
        event_types_supported: event_types_supported || null,
        sub_event_types_supported: sub_event_types_supported || null,
        total_area_sqft: total_area_sqft ? String(total_area_sqft) : null,
        parking_capacity: parking_capacity ? String(parking_capacity) : null,
        rooms_available: rooms_available ? String(rooms_available) : null,
        booking_status: booking_status || null,
        latitude: latitude ? String(latitude) : null,
        longitude: longitude ? String(longitude) : null,
        email: email || null,
        website: website || null,
        date: date || null,
        status: normalizedStatus
      }
    });

    console.log('Venue created successfully:', venue.id);

    res.status(201).json({
      data: { ...venue, bookings: 0 },
      message: 'Venue created successfully'
    });
  } catch (error) {
    console.error('Create venue error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to create venue',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      status: 500
    });
  }
});

// Update venue
router.put('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const venue = await prisma.venues.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!venue) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Venue not found',
        status: 404
      });
    }

    const {
      name, contact, address, location, capacity, description, amenities, status,
      venue_type, event_types_supported, sub_event_types_supported,
      total_area_sqft, parking_capacity, rooms_available, booking_status,
      latitude, longitude, email, website, date
    } = req.body;

    // Helper function to build update data - only include fields that are provided
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (contact !== undefined) updateData.contact = contact || null;
    if (address !== undefined) updateData.address = address || null;
    if (location !== undefined) updateData.location = location;
    if (capacity !== undefined) updateData.capacity = parseInt(capacity);
    if (description !== undefined) updateData.description = description || null;
    if (amenities !== undefined) updateData.amenities = amenities || null;
    if (venue_type !== undefined) updateData.venue_type = venue_type || null;
    if (event_types_supported !== undefined) updateData.event_types_supported = event_types_supported || null;
    if (sub_event_types_supported !== undefined) updateData.sub_event_types_supported = sub_event_types_supported || null;
    if (total_area_sqft !== undefined) updateData.total_area_sqft = total_area_sqft ? String(total_area_sqft) : null;
    if (parking_capacity !== undefined) updateData.parking_capacity = parking_capacity ? String(parking_capacity) : null;
    if (rooms_available !== undefined) updateData.rooms_available = rooms_available ? String(rooms_available) : null;
    if (booking_status !== undefined) updateData.booking_status = booking_status || null;
    if (latitude !== undefined) updateData.latitude = latitude ? String(latitude) : null;
    if (longitude !== undefined) updateData.longitude = longitude ? String(longitude) : null;
    if (email !== undefined) updateData.email = email || null;
    if (website !== undefined) updateData.website = website || null;
    if (date !== undefined) updateData.date = date || null;
    
    // Normalize status to match enum (ACTIVE, MAINTENANCE, INACTIVE)
    if (status !== undefined) {
      let normalizedStatus = status;
      if (typeof status === 'string') {
        normalizedStatus = status.toUpperCase();
        if (['ACTIVE', 'MAINTENANCE', 'INACTIVE'].includes(normalizedStatus)) {
          updateData.status = normalizedStatus;
        }
      }
    }

    const updatedVenue = await prisma.venues.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
      include: {
        _count: {
          select: { events: true }
        }
      }
    });

    res.json({
      data: { ...updatedVenue, bookings: updatedVenue._count.events },
      message: 'Venue updated successfully'
    });
  } catch (error) {
    console.error('Update venue error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to update venue',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      status: 500
    });
  }
});

// Delete venue
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const venue = await prisma.venues.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!venue) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Venue not found',
        status: 404
      });
    }

    await prisma.venues.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({
      message: 'Venue deleted successfully'
    });
  } catch (error) {
    console.error('Delete venue error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete venue',
      status: 500
    });
  }
});

export default router;

