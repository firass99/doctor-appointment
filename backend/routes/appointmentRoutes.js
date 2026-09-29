import express from "express";
import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  getBookedSlots,
  getAppointmentById,
  updateStatus,
  cancelAppointment,
} from "../controllers/appointmentController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Booking and managing appointments
 */

// public
/**
 * @swagger
 * /api/appointments/availability:
 *   get:
 *     summary: Get the booked slots of a doctor for a day
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: doctor
 *         required: true
 *         description: The doctor's user id
 *         schema: { type: string }
 *       - in: query
 *         name: date
 *         required: true
 *         schema: { type: string, format: date, example: "2026-10-05" }
 *     responses:
 *       200:
 *         description: List of booked (non-cancelled) slots, sorted by start time
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   startTime: { type: string, example: "09:00" }
 *                   endTime: { type: string, example: "09:30" }
 *       400:
 *         description: Missing doctor, invalid date or invalid doctor id
 */
router.get("/availability", getBookedSlots);

// everything below requires login
router.use(protect);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Book an appointment (USER only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctor, date, startTime, endTime]
 *             properties:
 *               doctor: { type: string, description: "Doctor's user id" }
 *               date: { type: string, format: date, example: "2026-10-05" }
 *               startTime: { type: string, example: "09:00" }
 *               endTime: { type: string, example: "09:30" }
 *               reason: { type: string, example: Headache }
 *     responses:
 *       201:
 *         description: Appointment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Validation error (missing fields, bad time format, past date, invalid doctor id)
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, only USER role can book
 *       404:
 *         description: Doctor not found
 *       409:
 *         description: Slot not available
 */
router.post("/", authorize("USER"), createAppointment);

/**
 * @swagger
 * /api/appointments/my:
 *   get:
 *     summary: Get my appointments (as patient, or as doctor if role is DOCTOR)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *     responses:
 *       200:
 *         description: List of appointments sorted by date and start time
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Not authorized
 */
router.get("/my", getMyAppointments);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get all appointments (ADMIN only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *       - in: query
 *         name: doctor
 *         required: false
 *         description: Filter by doctor's user id
 *         schema: { type: string }
 *       - in: query
 *         name: patient
 *         required: false
 *         description: Filter by patient's user id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of appointments, newest date first
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, ADMIN only
 */
router.get("/", authorize("ADMIN"), getAllAppointments);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   patch:
 *     summary: Confirm, complete or cancel an appointment (DOCTOR or ADMIN)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The appointment id
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CONFIRMED, COMPLETED, CANCELLED]
 *               notes:
 *                 type: string
 *                 description: Doctor's notes (optional)
 *                 example: Bring previous test results
 *     responses:
 *       200:
 *         description: Updated appointment, the patient is notified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid status, invalid id, or appointment already cancelled/completed
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, a doctor can only update their own appointments
 *       404:
 *         description: Appointment not found
 */
router.patch("/:id/status", authorize("DOCTOR", "ADMIN"), updateStatus);

/**
 * @swagger
 * /api/appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel my own appointment (USER only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The appointment id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Appointment cancelled, the doctor is notified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid id, or appointment already cancelled/completed
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, this is not your appointment
 *       404:
 *         description: Appointment not found
 */
router.patch("/:id/cancel", authorize("USER"), cancelAppointment);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Get one appointment (its patient, its doctor, or an admin)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The appointment id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The appointment with doctor and patient details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid appointment id
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Appointment not found
 */
router.get("/:id", getAppointmentById);

export default router;
