import jwt from "jsonwebtoken";
import User, { ROLES } from "../models/user.js";
import bcrypt from "bcryptjs";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/users/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    // role is always USER here; admins can change it later
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "USER",
    });

    res.status(201).json({
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("STORED:", user.password);

    const isMatch = await bcrypt.compare(password, user.password); // plain first, hash second
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/me
export const getMe = async (req, res) => {
  res.json(req.user);
};

// PUT /api/users/me
export const updateMe = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) user.password = password; // hashed by the pre-save hook

    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/doctors  (optional ?speciality=<id>)
/* export const getDoctors = async (req, res) => {
  try {
    const filter = { role: "DOCTOR" };
    if (req.query.speciality) filter.speciality = req.query.speciality;

    const doctors = await User.find(filter).populate("speciality", "name icon");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; */

// GET /api/users  (admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/:id  (admin)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "speciality",
      "name",
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "Invalid user id" });
  }
};

// PATCH /api/users/:id/role  (admin)
export const updateRole = async (req, res) => {
  try {
    const { role, speciality } = req.body;

    if (!ROLES.includes(role)) {
      return res
        .status(400)
        .json({ message: `Role must be one of: ${ROLES.join(", ")}` });
    }

    const update = { role };
    if (role === "DOCTOR" && speciality) update.speciality = speciality;

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/users/:id  (admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid user id" });
  }
};
