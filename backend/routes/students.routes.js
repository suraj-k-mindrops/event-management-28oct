import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all students
router.get('/', authenticate, async (req, res) => {
  try {
    const students = await prisma.students.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    // Get directory entries and event packages
    const directoryEntries = await prisma.directory_entries.findMany();
    const eventPackages = await prisma.event_packages.findMany();

    // Enhance students with event counts
    const studentsWithEvents = students.map(student => {
      const directoryCount = directoryEntries.filter(
        entry => entry.organizerName?.toLowerCase() === student.name.toLowerCase()
      ).length;
      
      const packageCount = eventPackages.filter(
        pkg => pkg.organizerName?.toLowerCase() === student.name.toLowerCase()
      ).length;

      return {
        ...student,
        directoryCount,
        packageCount,
        totalCount: directoryCount + packageCount
      };
    });

    res.json({
      data: studentsWithEvents,
      message: 'Students retrieved successfully'
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve students',
      status: 500
    });
  }
});

// Get single student by user_id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const student = await prisma.students.findUnique({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Student not found',
        status: 404
      });
    }

    // Get event counts for this student (case-insensitive matching)
    const allDirectoryEntries = await prisma.directory_entries.findMany();
    const allEventPackages = await prisma.event_packages.findMany();
    
    const directoryEntries = allDirectoryEntries.filter(
      entry => entry.organizerName?.toLowerCase() === student.name.toLowerCase()
    );
    
    const eventPackages = allEventPackages.filter(
      pkg => pkg.organizerName?.toLowerCase() === student.name.toLowerCase()
    );

    const directoryCount = directoryEntries.length;
    const packageCount = eventPackages.length;

    res.json({
      data: {
        ...student,
        directoryCount,
        packageCount,
        totalCount: directoryCount + packageCount
      },
      message: 'Student retrieved successfully'
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve student',
      status: 500
    });
  }
});

// Create student
router.post('/', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const { name, email, phone, status, portfolioLink, address, organisation } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name, email, and phone are required',
        status: 400
      });
    }

    const student = await prisma.students.create({
      data: {
        name,
        email,
        phone,
        status: status || 'Active',
        portfolioLink,
        address,
        organisation
      }
    });

    res.status(201).json({
      data: student,
      message: 'Student created successfully'
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create student',
      status: 500
    });
  }
});

// Update student by user_id
router.put('/:id', authenticate, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const student = await prisma.students.findUnique({
      where: { user_id: userId }
    });

    if (!student) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Student not found',
        status: 404
      });
    }

    // Students can update their own profile; admins/organizers can update anyone
    const isSelf = req.user && (req.user.id === student.user_id);
    const isPrivileged = req.user && ['ADMIN', 'ORGANIZER'].includes(req.user.role);
    if (!isSelf && !isPrivileged) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions to update this profile',
        status: 403,
      });
    }

    const { name, phone, portfolioLink, address, organisation } = req.body;

    // Only include fields that are provided
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone || null;
    if (portfolioLink !== undefined) updateData.portfolioLink = portfolioLink || null;
    if (address !== undefined) updateData.address = address || null;
    if (organisation !== undefined) updateData.organisation = organisation || null;

    const updatedStudent = await prisma.students.update({
      where: { user_id: userId },
      data: updateData
    });

    res.json({
      data: updatedStudent,
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update student',
      status: 500
    });
  }
});

// Delete student by user_id (cascades to user due to onDelete: Cascade)
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const student = await prisma.students.findUnique({
      where: { user_id: userId }
    });

    if (!student) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Student not found',
        status: 404
      });
    }

    // Delete student (which will cascade to user due to onDelete: Cascade in schema)
    await prisma.students.delete({
      where: { user_id: userId }
    });

    res.json({
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete student',
      status: 500
    });
  }
});

export default router;

