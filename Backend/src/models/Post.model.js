import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    college: {
      type: Schema.Types.ObjectId,
      ref: "College",
    },
    media: {
      type: String,
    },
    category: {
      type: String,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    ],
  },
  { timestamps: true }
);

postSchema.plugin(aggregatePaginate);

export const Post = mongoose.model("Post", postSchema);
