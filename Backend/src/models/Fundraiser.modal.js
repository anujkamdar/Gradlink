import mongoose, { Schema } from "mongoose";

const fundRaiserSchema = new Schema(
  {
    college: {
      type: Schema.Types.ObjectId,
      ref: "College",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
    },
    category: {
      type: String,
    },
    targetAmount: {
      type: Number,
    },
    currentAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Fundraiser = mongoose.model("Fundraiser", fundRaiserSchema);
