import mongoose, { Schema } from "mongoose";

const donationSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    donor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fundraiser: {
      type: Schema.Types.ObjectId,
      ref: "Fundraiser",
    },
    college: {
      type: Schema.Types.ObjectId,
      ref: "College",
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Donation = mongoose.model("Donation", donationSchema);




