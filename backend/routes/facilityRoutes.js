import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Get all facilities
router.get('/', requireAuth, async (req, res) => {
  try {
    const facilities = [
      {
        id: 1,
        name: 'Library',
        type: 'academic',
        capacity: 200,
        status: 'available',
        location: 'Block A, Floor 2'
      },
      {
        id: 2,
        name: 'Computer Lab',
        type: 'academic',
        capacity: 50,
        status: 'available',
        location: 'Block B, Floor 1'
      },
      {
        id: 3,
        name: 'Hostel Room 101',
        type: 'accommodation',
        capacity: 2,
        status: 'occupied',
        location: 'Hostel Block 1'
      }
    ];

    res.json({
      success: true,
      data: facilities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching facilities',
      error: error.message
    });
  }
});

// Get facility bookings
router.get('/bookings', requireAuth, async (req, res) => {
  try {
    const bookings = [
      {
        id: 1,
        facilityId: 1,
        facilityName: 'Library',
        studentId: req.user.id,
        startTime: '2024-01-15T09:00:00Z',
        endTime: '2024-01-15T11:00:00Z',
        status: 'confirmed'
      }
    ];

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// Book a facility
router.post('/book', requireAuth, checkRole(['college_student', 'college_faculty']), async (req, res) => {
  try {
    const { facilityId, startTime, endTime, purpose } = req.body;

    // Placeholder for booking logic
    res.json({
      success: true,
      message: 'Facility booked successfully',
      data: {
        bookingId: Date.now(),
        facilityId,
        startTime,
        endTime,
        status: 'confirmed'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error booking facility',
      error: error.message
    });
  }
});

export default router;
