import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get single directory entry (must come before the / route)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const directoryEntry = await prisma.directory_entries.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!directoryEntry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Directory entry not found',
        status: 404
      });
    }

    res.json({
      data: directoryEntry,
      message: 'Directory entry retrieved successfully'
    });
  } catch (error) {
    console.error('Get directory entry error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve directory entry',
      status: 500
    });
  }
});

// Get all directory entries
router.get('/', authenticate, async (req, res) => {
  try {
    const { organizerName } = req.query;
    
    console.log('=== GET DIRECTORY ENTRIES REQUEST ===');
    console.log('Query params:', { organizerName });
    console.log('User:', req.user);

    const directoryEntries = await prisma.directory_entries.findMany({
      where: organizerName
        ? {
            organizerName: organizerName,
          }
        : undefined,
      orderBy: {
        dateOfEvent: 'desc',
      },
    });

    console.log(`Found ${directoryEntries.length} entries`);
    if (directoryEntries.length > 0) {
      console.log('Sample entry organizer:', directoryEntries[0].organizerName);
    }

    res.json({
      data: directoryEntries,
      message: 'Directory entries retrieved successfully',
    });
  } catch (error) {
    console.error('=== GET DIRECTORY ENTRIES ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to retrieve directory entries',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      status: 500,
    });
  }
});

// Create directory entry
router.post('/', authenticate, async (req, res) => {
  try {
    console.log('=== CREATE DIRECTORY ENTRY REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);
    
    const {
      typeOfEvent, nameOfEvent, venueLocation, dateOfEvent,
      teamsDepartmentsWorkprofile, targetAudience, theme, eventCompany,
      sponsors, vendors, manpowerRequired, logisticsServiceProvider,
      miscellaneous, mediaPhotos, mediaVideos, organizerName
    } = req.body;

    if (!typeOfEvent || !nameOfEvent || !venueLocation || !dateOfEvent || !organizerName) {
      console.error('Validation failed: Missing required fields');
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Type of event, name of event, venue location, date of event, and organizer name are required',
        status: 400
      });
    }

    console.log('Creating directory entry with data:', {
      typeOfEvent,
      nameOfEvent,
      venueLocation,
      dateOfEvent,
      organizerName
    });

    const directoryEntry = await prisma.directory_entries.create({
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
        organizerName
      }
    });

    console.log('Directory entry created successfully:', directoryEntry.id);

    res.status(201).json({
      data: directoryEntry,
      message: 'Directory entry created successfully'
    });
  } catch (error) {
    console.error('Create directory entry error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to create directory entry',
      status: 500
    });
  }
});

// Update directory entry
router.put('/:id', authenticate, async (req, res) => {
  try {
    const directoryEntry = await prisma.directory_entries.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!directoryEntry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Directory entry not found',
        status: 404
      });
    }

    // Allow students to update their own events, admins can update any
    const organizerNameNormalized = directoryEntry.organizerName?.toLowerCase().trim() || '';
    const userNameNormalized = req.user?.name?.toLowerCase().trim() || '';
    const userEmailNormalized = req.user?.email?.toLowerCase().trim() || '';
    
    const isOwner = req.user && organizerNameNormalized && (
      organizerNameNormalized === userNameNormalized ||
      organizerNameNormalized === userEmailNormalized
    );
    const isAdmin = req.user && ['ADMIN', 'ORGANIZER'].includes(req.user.role);
    
    if (!isOwner && !isAdmin) {
      console.log('Update check failed:', {
        organizerName: directoryEntry.organizerName,
        userName: req.user?.name,
        userEmail: req.user?.email,
        isOwner,
        isAdmin
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own events',
        status: 403,
      });
    }

    const {
      typeOfEvent, nameOfEvent, venueLocation, dateOfEvent,
      teamsDepartmentsWorkprofile, targetAudience, theme, eventCompany,
      sponsors, vendors, manpowerRequired, logisticsServiceProvider,
      miscellaneous, mediaPhotos, mediaVideos, organizerName
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

    const updatedDirectoryEntry = await prisma.directory_entries.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });

    res.json({
      data: updatedDirectoryEntry,
      message: 'Directory entry updated successfully'
    });
  } catch (error) {
    console.error('Update directory entry error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update directory entry',
      status: 500
    });
  }
});

// Delete directory entry
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const directoryEntry = await prisma.directory_entries.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!directoryEntry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Directory entry not found',
        status: 404
      });
    }

    // Allow students to delete their own events, admins can delete any
    const organizerNameNormalized = directoryEntry.organizerName?.toLowerCase().trim() || '';
    const userNameNormalized = req.user?.name?.toLowerCase().trim() || '';
    const userEmailNormalized = req.user?.email?.toLowerCase().trim() || '';
    
    const isOwner = req.user && organizerNameNormalized && (
      organizerNameNormalized === userNameNormalized ||
      organizerNameNormalized === userEmailNormalized
    );
    const isAdmin = req.user && ['ADMIN', 'ORGANIZER'].includes(req.user.role);
    
    if (!isOwner && !isAdmin) {
      console.log('Delete check failed:', {
        organizerName: directoryEntry.organizerName,
        userName: req.user?.name,
        userEmail: req.user?.email,
        isOwner,
        isAdmin
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own events',
        status: 403,
      });
    }

    await prisma.directory_entries.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({
      message: 'Directory entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete directory entry error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete directory entry',
      status: 500
    });
  }
});

export default router;

