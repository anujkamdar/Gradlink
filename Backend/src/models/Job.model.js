import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const jobSchema = new Schema(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    type: {
      type: String,
      required: true,
      lowercase: true,
      enum: ["full-time", "part-time", "internship"]
    },
    location: {
      type: String,
      lowercase: true,
    },
    applicants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

jobSchema.plugin(mongooseAggregatePaginate);

export const Job = mongoose.model("Job", jobSchema);
