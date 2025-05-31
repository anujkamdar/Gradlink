import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createJobApplication, createJobPosting, loginUser, logOutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);

// secure routes
userRouter.route("/logout").post(verifyJwt, logOutUser);

//only alum routes
userRouter.route("/create-job").post(verifyJwt,createJobPosting)

// student also routes
userRouter.route("/apply-job").post(verifyJwt,upload.single("resume"),createJobApplication)

export default userRouter;
