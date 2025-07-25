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
  getOtherUserProfileData,
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateJobApplicationStatus,
  getUserJobApplications,
  getUsers,
  registerCollegeandAdmin,
  createFundraiser,
  getAllCollege,
  getFundraisers,
  createPost,
  getPosts,
  getCollegeStats,
  toggleLike,
  addComment,
  getComments,
  createPaymentIntent,
  saveDonation,
  getMyDonations,
  getHomePageData,
  getMajors,
  deletePost,
  changeAvatar,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { verifyAlum } from "../middlewares/verifyalum.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/logout").get(verifyJwt, logOutUser);

userRouter.route("/register-college-and-admin").post(
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  registerCollegeandAdmin
);

userRouter.route("/get-all-colleges").get(getAllCollege);

//alum only
userRouter.route("/create-job").post(verifyJwt, verifyAlum, createJobPosting);

// vaise i dont think so i need verifyAlum here as i have already checked in the comtroller if that job is made by that user
userRouter.route("/update-application-status").post(verifyJwt, verifyAlum, updateJobApplicationStatus);
userRouter.route("/delete-job").post(verifyJwt, verifyAlum, deleteJob);
userRouter.route("/my-job-postings").get(verifyJwt, verifyAlum, getMyJobPostings);
userRouter.route("/get-job-applications/:jobId").get(verifyJwt, verifyAlum, getJobApplications);

userRouter.route("/apply-job").post(verifyJwt, upload.single("resume"), createJobApplication);
userRouter.route("/get-profile-data/:otherUserId").get(verifyJwt, getOtherUserProfileData);
userRouter.route("/current-user-profile").get(verifyJwt, getCurrentUserProfileData);
userRouter.route("/update-profile").post(verifyJwt, updateAccountDetails);
userRouter.route("/get-job-postings").post(verifyJwt, getJobPostings);
userRouter.route("/job/:jobId").get(verifyJwt, getJobById);
userRouter.route("/my-applications").get(verifyJwt, getUserJobApplications);
userRouter.route("/get-users").post(verifyJwt, getUsers);

userRouter.route("/create-fundraiser").post(verifyJwt, upload.single("coverImage"), createFundraiser);
userRouter.route("/get-fundraisers").get(verifyJwt, getFundraisers);

userRouter.route("/create-post").post(verifyJwt, upload.single("media"), createPost);
userRouter.route("/get-posts").post(verifyJwt, getPosts);
userRouter.route("/get-college-stats").get(verifyJwt, getCollegeStats);
userRouter.route("/toggle-like").post(verifyJwt, toggleLike);
userRouter.route("/add-comment").post(verifyJwt, addComment);
userRouter.route("/get-comments").post(verifyJwt, getComments);
userRouter.route("/create-payment-intent").post(verifyJwt, createPaymentIntent);
userRouter.route("/save-donation").post(verifyJwt, saveDonation);
userRouter.route("/get-my-donations").get(verifyJwt, getMyDonations);
userRouter.route("/get-homepage-data").get(verifyJwt, getHomePageData);
userRouter.route("/get-majors").get(verifyJwt, getMajors);
userRouter.route("/delete-post").post(verifyJwt, deletePost);

userRouter.route("/change-avatar").post(verifyJwt, upload.single("avatar"),changeAvatar);

userRouter.route("/ping").get((req, res) => {
  res.status(200).send("Pong");
});

// Alum Only Routes

export default userRouter;
