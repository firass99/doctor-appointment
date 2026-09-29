import Doctor from "../models/doctor.js";
import Speciality from "../models/speciality.js";
import User from "../models/user.js";

// GET /api/specialities  (public)
export const getSpecialities = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const specialities = await Speciality.find(filter).sort({ name: 1 });
    res.json(specialities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/specialities/:id  (public)
export const getSpecialityById = async (req, res) => {
  try {
    const speciality = await Speciality.findById(req.params.id);
    if (!speciality) {
      return res.status(404).json({ message: "Speciality not found" });
    }
    res.json(speciality);
  } catch (err) {
    res.status(400).json({ message: "Invalid speciality id" });
  }
};

// POST /api/specialities  (admin)
export const createSpeciality = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const speciality = await Speciality.create({ name, description, icon });
    res.status(201).json(speciality);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Speciality already exists" });
    }
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/specialities/:id  (admin)
export const updateSpeciality = async (req, res) => {
  try {
    const { name, description, icon, isActive } = req.body;

    const speciality = await Speciality.findByIdAndUpdate(
      req.params.id,
      { name, description, icon, isActive },
      { new: true, runValidators: true },
    );
    if (!speciality) {
      return res.status(404).json({ message: "Speciality not found" });
    }
    res.json(speciality);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Speciality name already used" });
    }
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/specialities/:id  (admin)
export const deleteSpeciality = async (req, res) => {
  try {
    const inUse = await Doctor.countDocuments({ speciality: req.params.id });
    if (inUse > 0) {
      return res.status(409).json({
        message: `Cannot delete: ${inUse} doctor(s) use it. Deactivate it instead (isActive: false).`,
      });
    }

    const speciality = await Speciality.findByIdAndDelete(req.params.id);
    if (!speciality) {
      return res.status(404).json({ message: "Speciality not found" });
    }
    res.json({ message: "Speciality deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid speciality id" });
  }
};
