import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

  return res.status(200).json(new ApiResponse(200, "heloo", "data is ok"));
});

export { registerUser };
