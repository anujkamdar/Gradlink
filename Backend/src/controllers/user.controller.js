import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

export { registerUser, loginUser, logOutUser, refreshAccessToken };
