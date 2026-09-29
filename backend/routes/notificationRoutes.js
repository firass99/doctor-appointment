import express from "express";
import {
  getMyNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
  deleteReadNotifications,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: In-app notifications of the logged-in user
 */

router.use(protect);

// fixed paths first, then the /:id ones
/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get my notifications (paginated, newest first)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: unread
 *         required: false
 *         description: Set to true to return only unread notifications
 *         schema: { type: boolean, example: true }
 *       - in: query
 *         name: page
 *         required: false
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Items per page (maximum 100)
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *     responses:
 *       200:
 *         description: A page of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 page: { type: integer, example: 1 }
 *                 totalPages: { type: integer, example: 3 }
 *                 total: { type: integer, example: 42 }
 *       401:
 *         description: Not authorized
 */
router.get("/", getMyNotifications);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get the number of my unread notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count, useful for a badge in the UI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count: { type: integer, example: 4 }
 *       401:
 *         description: Not authorized
 */
router.get("/unread-count", getUnreadCount);

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Mark all my notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Number of notifications updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated: { type: integer, example: 4 }
 *       401:
 *         description: Not authorized
 */
router.patch("/read-all", markAllAsRead);

/**
 * @swagger
 * /api/notifications/read:
 *   delete:
 *     summary: Delete all my notifications that are already read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Number of notifications deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted: { type: integer, example: 12 }
 *       401:
 *         description: Not authorized
 */
router.delete("/read", deleteReadNotifications);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark one of my notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The notification id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The updated notification
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Invalid notification id
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Notification not found
 */
router.patch("/:id/read", markAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete one of my notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The notification id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Notification deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Notification deleted }
 *       400:
 *         description: Invalid notification id
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Notification not found
 */
router.delete("/:id", deleteNotification);

export default router;
