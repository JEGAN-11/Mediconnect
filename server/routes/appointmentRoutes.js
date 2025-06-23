import express from 'express';
import {
  bookAppointment,
  getUserAppointments,
  getAllAppointments,
  markAppointmentCompleted
} from '../controllers/appointmentController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, bookAppointment);
router.get('/my', protect, getUserAppointments);

// Admin route
router.get('/', protect, adminOnly, getAllAppointments);

// Mark appointment as completed
router.patch('/:id/complete', protect, markAppointmentCompleted);

export default router;
