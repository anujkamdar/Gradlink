import express from "express";
import CookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middleware to parse JSON and URL-encoded data
// Middleware to handle cookies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(CookieParser());

// initialize user routes
import userRouter from "./routes/user.routes.js";
app.use("/gradlink/api/v1/users", userRouter);

export { app };
