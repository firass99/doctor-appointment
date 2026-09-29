import express from "express";
import {
  getDoctors,
  getDoctorById,
  getDoctorSlots,
  createDoctor,
  getMyProfile,
  updateMyProfile,
  setDoctorActive,
} from "../controllers/doctorController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctor profiles, working hours and free slots
 */

// public
/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: List active doctors
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: speciality
 *         required: false
 *         description: Filter by speciality id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of doctors with user and speciality details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Invalid speciality id
 */
router.get("/", getDoctors);

// doctor's own profile (must be above /:id)
/**
 * @swagger
 * /api/doctors/me:
 *   get:
 *     summary: Get my doctor profile (DOCTOR only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The logged-in doctor's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, DOCTOR only
 *       404:
 *         description: Doctor profile not found
 */
router.get("/me", protect, authorize("DOCTOR"), getMyProfile);

/**
 * @swagger
 * /api/doctors/me:
 *   put:
 *     summary: Update my profile, working hours and days off (DOCTOR only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio: { type: string, example: Cardiologist with 10 years of experience }
 *               price: { type: number, example: 50 }
 *               experienceYears: { type: number, example: 10 }
 *               slotDuration: { type: integer, minimum: 10, maximum: 120, example: 30 }
 *               workingHours:
 *                 type: array
 *                 description: One entry per day, day 0 = Sunday to 6 = Saturday
 *                 items:
 *                   $ref: '#/components/schemas/WorkingHours'
 *               daysOff:
 *                 type: array
 *                 items: { type: string, format: date, example: "2026-12-25" }
 *     responses:
 *       200:
 *         description: Updated profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Validation error (bad hours, duplicate day, invalid date)
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, DOCTOR only
 *       404:
 *         description: Doctor profile not found
 */
router.put("/me", protect, authorize("DOCTOR"), updateMyProfile);

// admin
/**
 * @swagger
 * /api/doctors:
 *   post:
 *     summary: Turn a user into a doctor (ADMIN only)
 *     description: Creates the doctor profile and sets the user's role to DOCTOR. If workingHours is omitted, Monday to Friday 09:00-17:00 with a 12:00-13:00 break is used.
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, speciality]
 *             properties:
 *               userId: { type: string, description: "Id of the user to promote" }
 *               speciality: { type: string, description: "Speciality id" }
 *               bio: { type: string }
 *               price: { type: number, example: 50 }
 *               experienceYears: { type: number, example: 5 }
 *               slotDuration: { type: integer, example: 30 }
 *               workingHours:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/WorkingHours'
 *     responses:
 *       201:
 *         description: Doctor profile created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Validation error, or the user is an admin
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, ADMIN only
 *       404:
 *         description: User or speciality not found
 *       409:
 *         description: This user already has a doctor profile
 */
router.post("/", protect, authorize("ADMIN"), createDoctor);

/**
 * @swagger
 * /api/doctors/{id}/active:
 *   patch:
 *     summary: Show or hide a doctor (ADMIN only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The doctor's user id
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isActive]
 *             properties:
 *               isActive: { type: boolean, example: false }
 *     responses:
 *       200:
 *         description: Updated doctor profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: isActive must be true or false, or invalid id
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, ADMIN only
 *       404:
 *         description: Doctor not found
 */
router.patch("/:id/active", protect, authorize("ADMIN"), setDoctorActive);

// public
/**
 * @swagger
 * /api/doctors/{id}/slots:
 *   get:
 *     summary: Get the free slots of a doctor for a day
 *     description: Built from the doctor's working hours, minus breaks, days off and booked appointments. Past dates return an empty list.
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The doctor's user id
 *         schema: { type: string }
 *       - in: query
 *         name: date
 *         required: true
 *         schema: { type: string, format: date, example: "2026-10-05" }
 *     responses:
 *       200:
 *         description: Free slots for that day
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date: { type: string, example: "2026-10-05" }
 *                 slotDuration: { type: integer, example: 30 }
 *                 slots:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       startTime: { type: string, example: "09:00" }
 *                       endTime: { type: string, example: "09:30" }
 *       400:
 *         description: Missing or invalid date, or invalid doctor id
 *       404:
 *         description: Doctor not found
 */
router.get("/:id/slots", getDoctorSlots);

/**
 * @swagger
 * /api/doctors/{id}:
 *   get:
 *     summary: Get one doctor
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The doctor's user id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Doctor with user and speciality details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Invalid doctor id
 *       404:
 *         description: Doctor not found
 */
router.get("/:id", getDoctorById);

export default router;
