import mongoose, { Schema } from "mongoose";

const collegeSchema = new Schema(
  {
    collegeName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    collegeEmail: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    majors: [
      {
        type: String,
        trim: true,
      },
    ],
    logo: {
      type: String,
    },
  },
  { timestamps: true }
);

export const College = mongoose.model("College", collegeSchema);
