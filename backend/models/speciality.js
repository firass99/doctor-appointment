import mongoose from "mongoose";

const specialitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Speciality name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    icon: {
      type: String, // image URL or icon name for the React UI
    },
    isActive: {
      type: Boolean,
      default: true, // hide a speciality without deleting it
    },
  },
  { timestamps: true },
);

const Speciality = mongoose.model("Speciality", specialitySchema);
export default Speciality;
