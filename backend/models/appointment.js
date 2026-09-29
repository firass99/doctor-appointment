import mongoose from "mongoose";

export const APPOINTMENT_STATUS = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
];

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // a user with role "DOCTOR"
      required: true,
    },
    date: {
      type: Date, // the day of the appointment
      required: [true, "Date is required"],
    },
    startTime: {
      type: String, // "09:00"
      required: true,
    },
    endTime: {
      type: String, // "09:30"
      required: true,
    },
    status: {
      type: String,
      enum: APPOINTMENT_STATUS,
      default: "PENDING",
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    notes: {
      type: String, // doctor's notes
      trim: true,
    },
  },
  { timestamps: true },
);

// Prevent double booking: same doctor, same day, same start time
appointmentSchema.index(
  { doctor: 1, date: 1, startTime: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: "CANCELLED" } } },
);
const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
