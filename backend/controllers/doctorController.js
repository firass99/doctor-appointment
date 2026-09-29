import Doctor from "../models/doctor.js";
import User from "../models/user.js";
import Speciality from "../models/speciality.js";
import { getFreeSlots } from "../utils/slots.js";

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

const toDay = (value) => {
  const d = new Date(value);
  if (isNaN(d)) return null;
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const validateWorkingHours = (list) => {
  if (!Array.isArray(list)) return "workingHours must be an array";
  const seen = new Set();

  for (const w of list) {
    if (!Number.isInteger(w.day) || w.day < 0 || w.day > 6) {
      return "day must be an integer from 0 (Sunday) to 6 (Saturday)";
    }
    if (seen.has(w.day)) return "Only one entry per day is allowed";
    seen.add(w.day);

    if (!TIME.test(w.start) || !TIME.test(w.end) || w.start >= w.end) {
      return "start and end must be HH:mm, with end after start";
    }
    if (w.breakStart || w.breakEnd) {
      if (
        !TIME.test(w.breakStart) ||
        !TIME.test(w.breakEnd) ||
        w.breakStart >= w.breakEnd ||
        w.breakStart < w.start ||
        w.breakEnd > w.end
      ) {
        return "Break must be HH:mm, inside working hours, with breakEnd after breakStart";
      }
    }
  }
  return null;
};

// default: Monday to Friday, 09:00-17:00, lunch 12:00-13:00
const defaultHours = [1, 2, 3, 4, 5].map((day) => ({
  day,
  start: "09:00",
  end: "17:00",
  breakStart: "12:00",
  breakEnd: "13:00",
}));

// GET /api/doctors?speciality=<id>  (public)
export const getDoctors = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.speciality) filter.speciality = req.query.speciality;

    const doctors = await Doctor.find(filter)
      .populate("user", "name email phone")
      .populate("speciality", "name icon")
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (err) {
    res.status(400).json({ message: "Invalid speciality id" });
  }
};

// GET /api/doctors/:id  (public, :id = doctor's user id)
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.params.id, isActive: true })
      .populate("user", "name email phone")
      .populate("speciality", "name icon");

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ message: "Invalid doctor id" });
  }
};

// GET /api/doctors/:id/slots?date=YYYY-MM-DD  (public)
export const getDoctorSlots = async (req, res) => {
  try {
    const day = toDay(req.query.date);
    if (!day)
      return res.status(400).json({ message: "A valid date is required" });

    const profile = await Doctor.findOne({
      user: req.params.id,
      isActive: true,
    });
    if (!profile) return res.status(404).json({ message: "Doctor not found" });

    const today = toDay(new Date());
    const slots = day < today ? [] : await getFreeSlots(profile, day);

    res.json({
      date: req.query.date,
      slotDuration: profile.slotDuration,
      slots,
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid doctor id" });
  }
};

// POST /api/doctors  (admin: turns a user into a doctor)
export const createDoctor = async (req, res) => {
  try {
    const {
      userId,
      speciality,
      bio,
      price,
      experienceYears,
      slotDuration,
      workingHours,
    } = req.body;

    if (!userId || !speciality) {
      return res
        .status(400)
        .json({ message: "userId and speciality are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "ADMIN") {
      return res.status(400).json({ message: "An admin cannot be a doctor" });
    }

    if (await Doctor.exists({ user: userId })) {
      return res
        .status(409)
        .json({ message: "This user already has a doctor profile" });
    }

    if (!(await Speciality.exists({ _id: speciality }))) {
      return res.status(404).json({ message: "Speciality not found" });
    }

    const hours = workingHours ?? defaultHours;
    const error = validateWorkingHours(hours);
    if (error) return res.status(400).json({ message: error });

    const doctor = await Doctor.create({
      user: userId,
      speciality,
      bio,
      price,
      experienceYears,
      slotDuration,
      workingHours: hours,
    });

    await User.findByIdAndUpdate(userId, { role: "DOCTOR" });

    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/doctors/me  (doctor)
export const getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate(
      "speciality",
      "name icon",
    );
    if (!doctor)
      return res.status(404).json({ message: "Doctor profile not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/doctors/me  (doctor edits own profile and hours)
export const updateMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor)
      return res.status(404).json({ message: "Doctor profile not found" });

    const { bio, price, experienceYears, slotDuration, workingHours, daysOff } =
      req.body;

    if (bio !== undefined) doctor.bio = bio;
    if (price !== undefined) doctor.price = price;
    if (experienceYears !== undefined) doctor.experienceYears = experienceYears;
    if (slotDuration !== undefined) doctor.slotDuration = slotDuration;

    if (workingHours !== undefined) {
      const error = validateWorkingHours(workingHours);
      if (error) return res.status(400).json({ message: error });
      doctor.workingHours = workingHours;
    }

    if (daysOff !== undefined) {
      if (!Array.isArray(daysOff)) {
        return res
          .status(400)
          .json({ message: "daysOff must be an array of dates" });
      }
      const days = daysOff.map(toDay);
      if (days.includes(null)) {
        return res
          .status(400)
          .json({ message: "daysOff contains an invalid date" });
      }
      doctor.daysOff = days;
    }

    await doctor.save();
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /api/doctors/:id/active  (admin: hide or show a doctor)
export const setDoctorActive = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ message: "isActive must be true or false" });
    }

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.params.id },
      { isActive },
      { new: true },
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ message: "Invalid doctor id" });
  }
};
