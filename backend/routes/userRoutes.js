import express from "express";
import {
  register,
  login,
  getMe,
  updateMe,
  getUsers,
  getUserById,
  updateRole,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Authentication and user management
 */

// public
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new patient account
 *     description: The role is always USER. An admin can change it later.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: John Doe }
 *               email: { type: string, example: john@mail.com }
 *               password: { type: string, minLength: 6, example: "123456" }
 *               phone: { type: string, example: "+21622000000" }
 *     responses:
 *       201:
 *         description: Account created, returns a JWT token and the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     name: { type: string }
 *                     email: { type: string }
 *                     role: { type: string, example: USER }
 *       400:
 *         description: Name, email and password are required
 *       409:
 *         description: Email already in use
 */
router.post("/register", register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: john@mail.com }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Returns a JWT token and the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     name: { type: string }
 *                     email: { type: string }
 *                     role: { type: string, example: USER }
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", login);
/* router.get("/doctors", getDoctors); */

// logged-in users
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The logged-in user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 */
router.get("/me", protect, getMe);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update my name, phone or password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: John Doe }
 *               phone: { type: string, example: "+21622000000" }
 *               password: { type: string, minLength: 6, example: "newpass123" }
 *     responses:
 *       200:
 *         description: Updated profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string }
 *                 name: { type: string }
 *                 email: { type: string }
 *                 phone: { type: string }
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put("/me", protect, updateMe);

// admin only
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, ADMIN only
 */
router.get("/", getUsers);
//router.get("/", protect, authorize("ADMIN"), getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get one user (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user id
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, ADMIN only
 *       404:
 *         description: User not found
 */
router.get("/:id", protect, authorize("ADMIN"), getUserById);

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Change a user's role (ADMIN only)
 *     description: To make someone a doctor, use POST /api/doctors instead, since it also creates the doctor profile.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user id
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid role, or DOCTOR requested (use POST /api/doctors)
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, ADMIN only
 *       404:
 *         description: User not found
 */
router.patch("/:id/role", protect, authorize("ADMIN"), updateRole);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: User deleted }
 *       400:
 *         description: Invalid user id
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, ADMIN only
 *       404:
 *         description: User not found
 */
router.delete("/:id", deleteUser);
//router.delete("/:id", protect, authorize("ADMIN"), deleteUser);

export default router;
