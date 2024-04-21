import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import userRoutes from "./routes/user.routes.js";
import followRoutes from "./routes/follow.routes.js";
import postRoutes from "./routes/post.routes.js";
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";
configDotenv();

// Database connection
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/follow", followRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("api/v1/like", likeRoutes);
app.use("api/v1/comment", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
