import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: true,
    },
    major: {
      type: String,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    avatar: {
        type: String,
        default: "https://images.pexels.com/photos/31989354/pexels-photo-31989354/free-photo-of-church-on-the-lady-of-our-rocks-island-montenegro.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Placeholder URL for avatar
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User",userSchema);