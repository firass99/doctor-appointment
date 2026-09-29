import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import specialityRoutes from "./routes/specialityRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

dotenv.config();

export const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/specialities", specialityRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/doctors", doctorRoutes);

// after dotenv.config() and app.use(express.json())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));

connectDB();
