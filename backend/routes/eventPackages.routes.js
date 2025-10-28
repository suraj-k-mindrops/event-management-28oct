import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all event packages
router.get('/', authenticate, async (req, res) => {
  try {
    const { organizerName } = req.query;
    
    const eventPackages = await prisma.event_packages.findMany({
      where: organizerName
        ? {
            organizerName: organizerName,
          }
        : undefined,
      orderBy: {
        dateOfEvent: 'desc'
      }
    });

    res.json({
      data: eventPackages,
      message: 'Event packages retrieved successfully'
    });
  } catch (error) {
    console.error('Get event packages error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve event packages',
      status: 500
    });
  }
});

// Get single event package
router.get('/:id', authenticate, async (req, res) => {
  try {
    const eventPackage = await prisma.event_packages.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!eventPackage) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Event package not found',
        status: 404
      });
    }

    res.json({
      data: eventPackage,
      message: 'Event package retrieved successfully'
    });
  } catch (error) {
    console.error('Get event package error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve event package',
      status: 500
    });
  }
});

// Create event package
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      typeOfEvent, nameOfEvent, venueLocation, dateOfEvent,
      teamsDepartmentsWorkprofile, targetAudience, theme, eventCompany,
      sponsors, vendors, manpowerRequired, logisticsServiceProvider,
      miscellaneous, mediaPhotos, mediaVideos, organizerName,
      successMetrics, totalAttended, feedback, rating
    } = req.body;

    if (!typeOfEvent || !nameOfEvent || !venueLocation || !dateOfEvent || !organizerName) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Type of event, name of event, venue location, date of event, and organizer name are required',
        status: 400
      });
    }

    const eventPackage = await prisma.event_packages.create({
      data: {
        typeOfEvent,
        nameOfEvent,
        venueLocation,
        dateOfEvent: new Date(dateOfEvent),
        teamsDepartmentsWorkprofile,
        targetAudience,
        theme,
        eventCompany,
        sponsors,
        vendors,
        manpowerRequired,
        logisticsServiceProvider,
        miscellaneous,
        mediaPhotos,
        mediaVideos,
        organizerName,
        successMetrics,
        totalAttended,
        feedback,
        rating
      }
    });

    res.status(201).json({
      data: eventPackage,
      message: 'Event package created successfully'
    });
  } catch (error) {
    console.error('Create event package error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create event package',
      status: 500
    });
  }
});

// Update event package
router.put('/:id', authenticate, async (req, res) => {
  try {
    const eventPackage = await prisma.event_packages.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!eventPackage) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Event package not found',
        status: 404
      });
    }

    const {
      typeOfEvent, nameOfEvent, venueLocation, dateOfEvent,
      teamsDepartmentsWorkprofile, targetAudience, theme, eventCompany,
      sponsors, vendors, manpowerRequired, logisticsServiceProvider,
      miscellaneous, mediaPhotos, mediaVideos, organizerName,
      successMetrics, totalAttended, feedback, rating
    } = req.body;

    // Only include fields that are provided
    const updateData = {};
    if (typeOfEvent !== undefined) updateData.typeOfEvent = typeOfEvent;
    if (nameOfEvent !== undefined) updateData.nameOfEvent = nameOfEvent;
    if (venueLocation !== undefined) updateData.venueLocation = venueLocation;
    if (dateOfEvent !== undefined) updateData.dateOfEvent = new Date(dateOfEvent);
    if (teamsDepartmentsWorkprofile !== undefined) updateData.teamsDepartmentsWorkprofile = teamsDepartmentsWorkprofile || null;
    if (targetAudience !== undefined) updateData.targetAudience = targetAudience || null;
    if (theme !== undefined) updateData.theme = theme || null;
    if (eventCompany !== undefined) updateData.eventCompany = eventCompany || null;
    if (sponsors !== undefined) updateData.sponsors = sponsors || null;
    if (vendors !== undefined) updateData.vendors = vendors || null;
    if (manpowerRequired !== undefined) updateData.manpowerRequired = manpowerRequired || null;
    if (logisticsServiceProvider !== undefined) updateData.logisticsServiceProvider = logisticsServiceProvider || null;
    if (miscellaneous !== undefined) updateData.miscellaneous = miscellaneous || null;
    if (mediaPhotos !== undefined) updateData.mediaPhotos = mediaPhotos || null;
    if (mediaVideos !== undefined) updateData.mediaVideos = mediaVideos || null;
    if (organizerName !== undefined) updateData.organizerName = organizerName;
    if (successMetrics !== undefined) updateData.successMetrics = successMetrics || null;
    if (totalAttended !== undefined) updateData.totalAttended = totalAttended || null;
    if (feedback !== undefined) updateData.feedback = feedback || null;
    if (rating !== undefined) updateData.rating = rating || null;

    const updatedEventPackage = await prisma.event_packages.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });

    res.json({
      data: updatedEventPackage,
      message: 'Event package updated successfully'
    });
  } catch (error) {
    console.error('Update event package error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update event package',
      status: 500
    });
  }
});

// Delete event package
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const eventPackage = await prisma.event_packages.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!eventPackage) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Event package not found',
        status: 404
      });
    }

    await prisma.event_packages.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({
      message: 'Event package deleted successfully'
    });
  } catch (error) {
    console.error('Delete event package error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete event package',
      status: 500
    });
  }
});

export default router;

