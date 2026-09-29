import mongoose from "mongoose";

const workingHoursSchema = new mongoose.Schema(
  {
    day: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday ... 6 = Saturday
    start: { type: String, required: true }, // "09:00"
    end: { type: String, required: true }, // "17:00"
    breakStart: { type: String }, // "12:00" (optional)
    breakEnd: { type: String }, // "13:00" (optional)
  },
  { _id: false },
);

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    speciality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speciality",
      required: true,
    },
    bio: { type: String, trim: true, maxlength: 1000 },
    price: { type: Number, min: 0, default: 0 },
    experienceYears: { type: Number, min: 0, default: 0 },
    slotDuration: { type: Number, min: 10, max: 120, default: 30 }, // minutes
    workingHours: [workingHoursSchema],
    daysOff: [Date], // holidays / vacations (stored at midnight UTC)
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
