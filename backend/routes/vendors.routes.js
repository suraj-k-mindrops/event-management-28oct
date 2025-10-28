import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all vendors
router.get('/', authenticate, async (req, res) => {
  try {
    const vendors = await prisma.vendors.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({
      data: vendors,
      message: 'Vendors retrieved successfully'
    });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve vendors',
      status: 500
    });
  }
});

// Get single vendor
router.get('/:id', authenticate, async (req, res) => {
  try {
    const vendor = await prisma.vendors.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!vendor) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Vendor not found',
        status: 404
      });
    }

    res.json({
      data: vendor,
      message: 'Vendor retrieved successfully'
    });
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve vendor',
      status: 500
    });
  }
});

// Create vendor
router.post('/', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const { name, category, contact, email, address, website } = req.body;

    if (!name || !category || !contact || !email) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name, category, contact, and email are required',
        status: 400
      });
    }

    const vendor = await prisma.vendors.create({
      data: {
        name,
        category,
        contact,
        email,
        address,
        website
      }
    });

    res.status(201).json({
      data: vendor,
      message: 'Vendor created successfully'
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create vendor',
      status: 500
    });
  }
});

// Update vendor
router.put('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), async (req, res) => {
  try {
    const vendor = await prisma.vendors.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!vendor) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Vendor not found',
        status: 404
      });
    }

    const { name, category, contact, email, address, website, status } = req.body;

    // Only include fields that are provided
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (contact !== undefined) updateData.contact = contact;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address || null;
    if (website !== undefined) updateData.website = website || null;
    if (status !== undefined) updateData.status = status;

    const updatedVendor = await prisma.vendors.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });

    res.json({
      data: updatedVendor,
      message: 'Vendor updated successfully'
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update vendor',
      status: 500
    });
  }
});

// Delete vendor
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const vendor = await prisma.vendors.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!vendor) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Vendor not found',
        status: 404
      });
    }

    await prisma.vendors.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    console.error('Delete vendor error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete vendor',
      status: 500
    });
  }
});

export default router;

