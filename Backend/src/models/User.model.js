import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

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
    },
    major: {
      type: String,
    },
    skills: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    avatar: {
      type: String,
      default:
        "https://images.pexels.com/photos/31989354/pexels-photo-31989354/free-photo-of-church-on-the-lady-of-our-rocks-island-montenegro.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Placeholder URL for avatar
    },
    bio: {
      type: String,
    },
    company: {
      type:String,
      trim:true
    },
    position:{
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    college:{
      type: Schema.Types.ObjectId,
      ref: "College",
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

userSchema.plugin(aggregatePaginate);

export const User = mongoose.model("User", userSchema);
