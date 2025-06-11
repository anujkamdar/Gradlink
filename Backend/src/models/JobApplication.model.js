import mongoose, { Schema } from "mongoose";

const jobApplicationSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
    appliedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    coverLetter: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);