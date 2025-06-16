import express from 'express';
import {
  createDoctor,
  getAllDoctors,     // ✅ use the correct name
  deleteDoctor,
  updateDoctor
} from '../controllers/doctorController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Public: anyone can view doctors
router.get('/', getAllDoctors);

// ✅ Protected (admin only): add, update, delete
router.post('/', protect, adminOnly, createDoctor);
router.put('/:id', protect, adminOnly, updateDoctor);
router.delete('/:id', protect, adminOnly, deleteDoctor);

export default router;
