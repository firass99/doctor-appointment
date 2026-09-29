import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const ROLES = ["ADMIN", "DOCTOR", "USER"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ROLES,
      default: "USER",
    },
  },
  { timestamps: true }, // adds createdAt & updatedAt
);

const User = mongoose.model("User", userSchema); // collection: "users"
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default User;
