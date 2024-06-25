import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import userRoutes from "./routes/user.routes.js";
import followRoutes from "./routes/follow.routes.js";
import postRoutes from "./routes/post.routes.js";
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import repostRoutes from "./routes/repost.routes.js";
import feedRoutes from "./routes/feed.routes.js";
import pollRoutes from "./routes/poll.routes.js";
import authRoutes from "./routes/auth.routes.js"
import accountRoutes from "./routes/account.routes.js"
import setupPassport from "./services/passport.js";
import dashboardRouter from "./routes/dashboard.routes.js";
configDotenv();

// Database connection
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

setupPassport(app);

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/repost", repostRoutes);
app.use("/api/v1/feed", feedRoutes);
app.use("/api/v1/follow", followRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/like", likeRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/poll", pollRoutes);
app.use("/auth", authRoutes);
app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/dashboard", dashboardRouter)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
