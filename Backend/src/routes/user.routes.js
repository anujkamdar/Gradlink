import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createJobApplication,
  createJobPosting,
  getCurrentUserProfileData,
  getJobPostings,
  getUserProfileData,
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);

// secure routes
userRouter.route("/logout").get(verifyJwt, logOutUser);

//only alum routes
userRouter.route("/create-job").post(verifyJwt, createJobPosting);

// student also routes
userRouter.route("/apply-job").post(verifyJwt, upload.single("resume"), createJobApplication);
userRouter.route("/get-profile-data/:userId").get(verifyJwt, getUserProfileData);
userRouter.route("/current-user-profile").get(verifyJwt, getCurrentUserProfileData);
userRouter.route("/update-profile").post(verifyJwt, updateAccountDetails);
userRouter.route("/get-job-postings").post(verifyJwt, getJobPostings);

export default userRouter;
