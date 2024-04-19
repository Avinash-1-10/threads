import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
configDotenv();

// Database connection
connectDB();

const app = express();

const PORT = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
