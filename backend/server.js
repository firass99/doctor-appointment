import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chalk from "chalk";
import connectDB from "./config/db.js";

dotenv.config();

export const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
connectDB();
