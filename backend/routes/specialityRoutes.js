import express from "express";
import {
  getSpecialities,
  getSpecialityById,
  createSpeciality,
  updateSpeciality,
  deleteSpeciality,
} from "../controllers/specialityController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Specialities
 *   description: Medical specialities (cardiology, dermatology, ...)
 */

// public
/**
 * @swagger
 * /api/specialities:
 *   get:
 *     summary: List specialities
 *     description: Returns only active specialities by default, sorted by name.
 *     tags: [Specialities]
 *     parameters:
 *       - in: query
 *         name: all
 *         required: false
 *         description: Set to true to include inactive specialities too
 *         schema: { type: boolean, example: false }
 *     responses:
 *       200:
 *         description: List of specialities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Speciality'
 */
router.get("/", getSpecialities);

/**
 * @swagger
 * /api/specialities/{id}:
 *   get:
 *     summary: Get one speciality
 *     tags: [Specialities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The speciality id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The speciality
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Speciality'
 *       400:
 *         description: Invalid speciality id
 *       404:
 *         description: Speciality not found
 */
router.get("/:id", getSpecialityById);

// admin only
/**
 * @swagger
 * /api/specialities:
 *   post:
 *     summary: Create a speciality (ADMIN only)
 *     tags: [Specialities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: Cardiology }
 *               description: { type: string, example: Heart and blood vessels }
 *               icon: { type: string, description: "Image URL or icon name" }
 *     responses:
 *       201:
 *         description: Speciality created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Speciality'
 *       400:
 *         description: Name is required or validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, ADMIN only
 *       409:
 *         description: Speciality already exists
 */
router.post("/", protect, authorize("ADMIN"), createSpeciality);

/**
 * @swagger
 * /api/specialities/{id}:
 *   put:
 *     summary: Update a speciality (ADMIN only)
 *     tags: [Specialities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The speciality id
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: Cardiology }
 *               description: { type: string }
 *               icon: { type: string }
 *               isActive: { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Updated speciality
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Speciality'
 *       400:
 *         description: Validation error or invalid id
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, ADMIN only
 *       404:
 *         description: Speciality not found
 *       409:
 *         description: Speciality name already used
 */
router.put("/:id", protect, authorize("ADMIN"), updateSpeciality);

/**
 * @swagger
 * /api/specialities/{id}:
 *   delete:
 *     summary: Delete a speciality (ADMIN only)
 *     description: Refused if doctors still use it. Set isActive to false with PUT instead.
 *     tags: [Specialities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The speciality id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Speciality deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Speciality deleted }
 *       400:
 *         description: Invalid speciality id
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, ADMIN only
 *       404:
 *         description: Speciality not found
 *       409:
 *         description: Cannot delete, doctors still use this speciality
 */
router.delete("/:id", protect, authorize("ADMIN"), deleteSpeciality);

export default router;
