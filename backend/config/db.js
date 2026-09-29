import chalk from "chalk";
import mongoose from "mongoose";
import { app } from "../server.js";

// connect to MongoDB, then start the server
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(chalk.green.bold("✔ MongoDB connected"));
      app.listen(PORT, () => {
        console.log(
          chalk.bgGreenBright.black.bold(" SERVER ") +
            chalk.cyan(` Running on http://localhost:${PORT}`),
        );
      });
    })
    .catch((err) => {
      console.error(chalk.red.bold("✖ MongoDB connection error:"));
      console.error(chalk.red(`  ${err.message}`));
      process.exit(1);
    });
};
export default connectDB;
