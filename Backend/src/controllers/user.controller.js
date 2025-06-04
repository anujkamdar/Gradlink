import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary, uploadPdfOnCloudinary } from "../utils/cloudinary.js";
import { Job } from "../models/Job.model.js";
import { JobApplication } from "../models/JobApplication.model.js";

const options = {
  httpOnly: true,
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  const { role, email, fullname, graduationYear, major, password } = req.body; // currently not using skills in the registration process

  if (!role || !email || !fullname || !graduationYear || !password || !major) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({ email: email.toLowerCase().trim() });

  if (userExists) {
    throw new ApiError(409, "User with email already exists");
  }

  const avatarlocalPath = req.file?.path;
  if (!avatarlocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarlocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    role: role,
    email: email.toLowerCase().trim(),
    fullname: fullname.trim(),
    graduationYear: graduationYear,
    major: major.trim(),
    password: password,
    avatar: avatar.url,
  });

  if (!user) {
    throw new ApiError(500, "User registration failed");
  }

  return res.status(200).json(new ApiResponse(200, user, "data is ok"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPassValid = await user.isPasswordCorrect(password);
  if (!isPassValid) {
    throw new ApiError(401, "Invalid password");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {}, "Logged in successfully"));
});

const logOutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
      // or by
      // $unset: {
      //   refreshToken: 1,
      // },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, user, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decoded?._id);

  if (!user) {
    throw new ApiError(404, "Invalid refresh token or user not found");
  }

  // like isse ye check hogya ki logged out to nhi h na koi like khud cookie me daal de token to isiliye logout karte time removed the refresh token from user
  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(403, "Refresh token is expired or used");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  user.save();

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {}, "Access token refreshed successfully"));
});

const createJobPosting = asyncHandler(async (req, res) => {
  const { title, company, description, requiredSkills } = req.body;
  const postedBy = req.user._id; // assuming user is authenticated and _id is available in req.user
  if (!title) {
    throw new ApiError(400, "Job title is required");
  }
  if (!company) {
    throw new ApiError(400, "Company name is required");
  }
  if (!description) {
    throw new ApiError(400, "Job description is required");
  }
  if (!requiredSkills || requiredSkills.length === 0) {
    throw new ApiError(400, "At least one required skill is needed");
  }

  const job = await Job.create({
    postedBy: postedBy,
    title: title.trim(),
    company: company.trim(),
    description: description.trim(),
    requiredSkills: requiredSkills.map((skill) => skill.trim()),
  });

  if (!job) {
    throw new ApiError(500, "Job posting failed");
  }

  return res.status(201).json(new ApiResponse(201, job, "Job posted successfully"));
});

const createJobApplication = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;
  const userApplying = req.user._id; // assuming user is authenticated and _id is available in req.user
  const resumeLocalPath = req.file?.path;

  if (!resumeLocalPath) {
    throw new ApiError(400, "Resume file is required");
  }

  if (!jobId) {
    throw new ApiError(400, "Job ID is required");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const resume = await uploadPdfOnCloudinary(resumeLocalPath);
  if (!resume) {
    throw new ApiError(400, "Resume upload failed");
  }

  const application = await JobApplication.create({
    jobId: jobId,
    appliedBy: userApplying,
    coverLetter: coverLetter,
    resumeUrl: resume.url,
  });

  return res.status(201).json(new ApiResponse(201, application, "Job application created successfully"));
});


const getCurrentUserProfileData = asyncHandler(async(req,res) => {
  const userId = req.user._id;
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  } // this error wont happen as already checked in verifyJwt

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiResponse(200, user, "User profile data retrieved successfully"));
})


const getUserProfileData = asyncHandler(async(req,res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "User profile data retrieved successfully"));
  
})

const updateAccountDetails = asyncHandler(async(req,res) => {
  const userDetails = req.body;

  if(req.body._id != req.user._id){
    throw new ApiError(403, "You are not authorized to update this account");
  }


  const updatedDetails = await User.findByIdAndUpdate(req.body._id,userDetails);
  res
  .status(200)
  .json(new ApiResponse(200,updatedDetails,"Updated success"))

})



export { registerUser, loginUser, logOutUser, refreshAccessToken, createJobPosting, createJobApplication , getCurrentUserProfileData ,getUserProfileData,updateAccountDetails};
