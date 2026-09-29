import mongoose from "mongoose";

export const NOTIFICATION_TYPES = [
  "APPOINTMENT_CREATED",
  "APPOINTMENT_CONFIRMED",
  "APPOINTMENT_CANCELLED",
  "APPOINTMENT_REMINDER",
  "SYSTEM",
];

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // optional: who triggered it (null for system messages)
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      default: "SYSTEM",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment", // optional link to the related appointment
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// fast query: unread notifications of a user, newest first
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// auto-delete notifications older than 90 days
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 },
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
