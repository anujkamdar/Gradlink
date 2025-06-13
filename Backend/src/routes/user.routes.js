import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createJobApplication,
  createJobPosting,
  deleteJob,
  getCurrentUserProfileData,
  getJobApplications,
  getJobById,
  getJobPostings,
  getMyJobPostings,
  getUserProfileData,
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateJobApplicationStatus,
  getUserJobApplications
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);

userRouter.route("/logout").get(verifyJwt, logOutUser);
userRouter.route("/create-job").post(verifyJwt, createJobPosting);
userRouter.route("/apply-job").post(verifyJwt, upload.single("resume"), createJobApplication);
userRouter.route("/get-profile-data/:userId").get(verifyJwt, getUserProfileData);
userRouter.route("/current-user-profile").get(verifyJwt, getCurrentUserProfileData);
userRouter.route("/update-profile").post(verifyJwt, updateAccountDetails);
userRouter.route("/get-job-postings").post(verifyJwt, getJobPostings);
userRouter.route("/job/:jobId").get(verifyJwt, getJobById);
userRouter.route("/delete-job").post(verifyJwt, deleteJob);
userRouter.route("/my-job-postings").get(verifyJwt, getMyJobPostings);
userRouter.route("/get-job-applications/:jobId").get(verifyJwt, getJobApplications);
userRouter.route("/update-application-status").post(verifyJwt, updateJobApplicationStatus);
userRouter.route("/my-applications").get(verifyJwt, getUserJobApplications);

export default userRouter;
