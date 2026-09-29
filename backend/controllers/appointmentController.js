import Appointment from "../models/appointment.js";
import Notification from "../models/notification.js";
import mongoose from "mongoose";
import Doctor from "../models/doctor.js";
import { getFreeSlots } from "../utils/slots.js";

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

// normalize a date to midnight UTC so the unique index works
const toDay = (value) => {
  const d = new Date(value);
  if (isNaN(d)) return null;
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const notify = (data) =>
  Notification.create(data).catch((err) =>
    console.error("Notification error:", err.message),
  );

// POST /api/appointments  (patient books)
export const createAppointment = async (req, res) => {
  try {
    const { doctor, date, startTime, endTime, reason } = req.body;

    if (!doctor || !date || !startTime || !endTime) {
      return res
        .status(400)
        .json({ message: "doctor, date, startTime and endTime are required" });
    }

    if (!mongoose.isValidObjectId(doctor)) {
      return res.status(400).json({ message: "Invalid doctor id" });
    }

    if (!TIME_REGEX.test(startTime) || !TIME_REGEX.test(endTime)) {
      return res.status(400).json({ message: "Time must be in HH:mm format" });
    }
    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ message: "endTime must be after startTime" });
    }

    const day = toDay(date);
    if (!day) return res.status(400).json({ message: "Invalid date" });

    const today = toDay(new Date());
    if (day < today) {
      return res.status(400).json({ message: "Cannot book in the past" });
    }

    const profile = await Doctor.findOne({ user: doctor, isActive: true });
    if (!profile) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // the slot must be one of the doctor's real free slots
    const freeSlots = await getFreeSlots(profile, day);
    const isFree = freeSlots.some(
      (s) => s.startTime === startTime && s.endTime === endTime,
    );
    if (!isFree) {
      return res.status(409).json({ message: "This slot is not available" });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      date: day,
      startTime,
      endTime,
      reason,
    });

    await notify({
      recipient: doctor,
      sender: req.user._id,
      type: "APPOINTMENT_CREATED",
      title: "New appointment request",
      message: `${req.user.name} requested an appointment on ${day.toISOString().slice(0, 10)} at ${startTime}.`,
      appointment: appointment._id,
    });

    res.status(201).json(appointment);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "This time slot is already taken" });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/my  (patient sees theirs, doctor sees theirs)
export const getMyAppointments = async (req, res) => {
  try {
    const filter =
      req.user.role === "DOCTOR"
        ? { doctor: req.user._id }
        : { patient: req.user._id };

    if (req.query.status) filter.status = req.query.status.toUpperCase();

    const appointments = await Appointment.find(filter)
      .populate("doctor", "name email")
      .populate("patient", "name email phone")
      .sort({ date: 1, startTime: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments  (admin: all, with optional filters)
export const getAllAppointments = async (req, res) => {
  try {
    const { status, doctor, patient } = req.query;
    const filter = {};
    if (status) filter.status = status.toUpperCase();
    if (doctor) filter.doctor = doctor;
    if (patient) filter.patient = patient;

    const appointments = await Appointment.find(filter)
      .populate("doctor", "name email")
      .populate("patient", "name email")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/availability?doctor=<id>&date=YYYY-MM-DD
export const getBookedSlots = async (req, res) => {
  try {
    const { doctor, date } = req.query;
    const day = toDay(date);

    if (!doctor || !day) {
      return res
        .status(400)
        .json({ message: "doctor and a valid date are required" });
    }

    const booked = await Appointment.find({
      doctor,
      date: day,
      status: { $ne: "CANCELLED" },
    })
      .select("startTime endTime -_id")
      .sort({ startTime: 1 });

    res.json(booked);
  } catch (err) {
    res.status(400).json({ message: "Invalid doctor id" });
  }
};

// GET /api/appointments/:id
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctor", "name email")
      .populate("patient", "name email phone");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const isOwner =
      appointment.patient._id.equals(req.user._id) ||
      appointment.doctor._id.equals(req.user._id);

    if (!isOwner && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: "Invalid appointment id" });
  }
};

// PATCH /api/appointments/:id/status  (doctor or admin)
// body: { status: "CONFIRMED" | "COMPLETED" | "CANCELLED", notes? }
export const updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const allowed = ["CONFIRMED", "COMPLETED", "CANCELLED"];

    if (!allowed.includes(status)) {
      return res
        .status(400)
        .json({ message: `Status must be one of: ${allowed.join(", ")}` });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      req.user.role === "DOCTOR" &&
      !appointment.doctor.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "This is not your appointment" });
    }

    if (["CANCELLED", "COMPLETED"].includes(appointment.status)) {
      return res.status(400).json({
        message: `Appointment is already ${appointment.status.toLowerCase()}`,
      });
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    const typeMap = {
      CONFIRMED: "APPOINTMENT_CONFIRMED",
      CANCELLED: "APPOINTMENT_CANCELLED",
      COMPLETED: "SYSTEM",
    };

    await notify({
      recipient: appointment.patient,
      sender: req.user._id,
      type: typeMap[status],
      title: `Appointment ${status.toLowerCase()}`,
      message: `Your appointment on ${appointment.date.toISOString().slice(0, 10)} at ${appointment.startTime} was ${status.toLowerCase()}.`,
      appointment: appointment._id,
    });

    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /api/appointments/:id/cancel  (the patient cancels their own)
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!appointment.patient.equals(req.user._id)) {
      return res.status(403).json({ message: "This is not your appointment" });
    }

    if (["CANCELLED", "COMPLETED"].includes(appointment.status)) {
      return res.status(400).json({
        message: `Appointment is already ${appointment.status.toLowerCase()}`,
      });
    }

    appointment.status = "CANCELLED";
    await appointment.save();

    await notify({
      recipient: appointment.doctor,
      sender: req.user._id,
      type: "APPOINTMENT_CANCELLED",
      title: "Appointment cancelled",
      message: `${req.user.name} cancelled the appointment on ${appointment.date.toISOString().slice(0, 10)} at ${appointment.startTime}.`,
      appointment: appointment._id,
    });

    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: "Invalid appointment id" });
  }
};
