import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";
import mongoose, { Mongoose } from "mongoose";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary, uploadPdfOnCloudinary } from "../utils/cloudinary.js";
import { Job } from "../models/Job.model.js";
import { JobApplication } from "../models/JobApplication.model.js";
import { College } from "../models/College.model.js";
import { Fundraiser } from "../models/Fundraiser.model.js";
import { Post } from "../models/Post.model.js";
import { Comment } from "../models/Comment.model.js";
import { Donation } from "../models/Donation.model.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { sendMail } from "../utils/SendMailUtil.js";
import { sendWelcomeEmail } from "../utils/EmailService.js";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

const getAllCollege = asyncHandler(async (req, res) => {
  const colleges = await College.find({}, "_id collegeName majors");
  res.status(200).json(new ApiResponse(200, colleges, "Colleges fetched successfully"));
});

const registerCollegeandAdmin = asyncHandler(async (req, res) => {
  let { collegeEmail, phoneNumber, collegeName, location, majors, fullname, adminEmail, password } = req.body;
  majors = JSON.parse(majors);

  if (!collegeEmail) {
    throw new ApiError(400, "College email is required");
  }
  if (!phoneNumber) {
    throw new ApiError(400, "Phone number is required");
  }
  if (!collegeName) {
    throw new ApiError(400, "College name is required");
  }
  if (!location) {
    throw new ApiError(400, "Location is required");
  }
  if (!majors || majors.length === 0) {
    throw new ApiError(400, "At least one major is required");
  }
  if (!fullname) {
    throw new ApiError(400, "Admin fullname is required");
  }
  if (!adminEmail) {
    throw new ApiError(400, "Admin email is required");
  }
  if (!password) {
    throw new ApiError(400, "Admin password is required");
  }

  const collegeExists = await College.findOne({
    $or: [{ collegeEmail: collegeEmail.trim().toLowerCase() }, { collegeName: collegeName.trim() }],
  });
  if (collegeExists) {
    throw new ApiError(409, "College with this email or name already exists");
  }
  const adminExists = await User.findOne({ email: adminEmail.toLowerCase().trim() });
  if (adminExists) {
    throw new ApiError(409, "Admin with this email already exists");
  }

  const logoLocalPath = req.files?.logo[0]?.path;
  if (!logoLocalPath) {
    throw new ApiError(400, "College logo file is required");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Admin avatar file is required");
  }

  const logo = await uploadOnCloudinary(logoLocalPath);
  if (!logo) {
    throw new ApiError(400, "College logo upload failed");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Admin avatar upload failed");
  }

  const college = await College.create({
    collegeName: collegeName,
    phoneNumber: phoneNumber,
    location: location,
    collegeEmail: collegeEmail,
    majors: majors,
    logo: logo.url,
  });

  if (!college) {
    throw new ApiError(500, "College registration failed");
  }

  const user = await User.create({
    role: "admin",
    email: adminEmail.toLowerCase().trim(),
    fullname: fullname.trim(),
    password: password,
    avatar: avatar.url,
    college: college._id,
  });

  if (!user) {
    throw new ApiError(500, "Admin registration failed");
  }

  return res.status(200).json(new ApiResponse(200, {}, "College and admin registered successfully"));
});

const registerUser = asyncHandler(async (req, res) => {
  const { role, email, fullname, graduationYear, major, password, collegeId } = req.body; // currently not using skills in the registration process

  if (!role || !email || !fullname || !graduationYear || !password || !major || !collegeId) {
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
    college: collegeId,
  });

  if (!user) {
    throw new ApiError(500, "User registration failed");
  }

  setImmediate(async () => {
    try {
      const college = await College.findById(collegeId);
      const collegeName = college ? college.collegeName : "Your College";
      await sendWelcomeEmail(email, fullname, collegeName, role);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }
  });

  return res.status(200).json(new ApiResponse(200, user, "User registered successfully"));
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

const createJobPosting = asyncHandler(async (req, res) => {
  const { title, company, description, requiredSkills, type, location } = req.body;
  const postedBy = req.user._id; // assuming user is authenticated and _id is available in req.user
  const collegeId = req.user.college;
  if (!title) {
    throw new ApiError(400, "Job title is required");
  }
  if (!company) {
    throw new ApiError(400, "Company name is required");
  }
  if (!description) {
    throw new ApiError(400, "Job description is required");
  }
  if (!requiredSkills || requiredSkills.length === 0) {
    throw new ApiError(400, "At least one required skill is needed");
  }
  if (!type) {
    throw new ApiError(400, "Job type is required");
  }
  if (!location) {
    throw new ApiError(400, "Job location is required");
  }

  const job = await Job.create({
    postedBy: postedBy,
    title: title.trim(),
    company: company.trim(),
    description: description.trim(),
    requiredSkills: requiredSkills.map((skill) => skill.trim()),
    type: type.trim(),
    location: location.trim(),
    college: collegeId,
  });

  if (!job) {
    throw new ApiError(500, "Job posting failed");
  }

  setImmediate(async () => {
    try {
      const jobSkills = requiredSkills.map((skill) => skill.toLowerCase().trim());

      const matchingUsers = await User.find({
        college: collegeId,
        role: { $in: ["student", "alumni"] },
        _id: { $ne: postedBy },
        skills: { $in: jobSkills },
      }).select("email fullname skills");

      if (matchingUsers.length > 0) {
        const jobPoster = await User.findById(postedBy).select("fullname");

        const emailPromises = matchingUsers.map(async (user) => {
          const userSkills = user.skills || [];
          const matchedSkills = userSkills.filter((skill) => jobSkills.includes(skill));

          const emailSubject = `New Job Opportunity: ${title} at ${company}`;
          const emailText = `
            Dear ${user.fullname},

            A new job opportunity has been posted that matches your skills!

            Job Details:
            - Position: ${title}
            - Company: ${company}
            - Location: ${location}
            - Type: ${type}
            - Posted by: ${jobPoster?.fullname || "Unknown"}

            Your Matching Skills: ${matchedSkills.join(", ")}
            Required Skills: ${requiredSkills.join(", ")}

            Job Description:
            ${description}

            Don't miss this opportunity! Log in to GradLink to view the full job details and apply.

            Best regards,
            GradLink Team
          `;

          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                🎯 New Job Opportunity Match!
              </h2>
              
              <p>Dear <strong>${user.fullname}</strong>,</p>
              
              <p>Great news! A new job opportunity has been posted that matches your skills.</p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
                <h3 style="color: #007bff; margin-top: 0;">Job Details</h3>
                <ul style="list-style: none; padding: 0;">
                  <li><strong>Position:</strong> ${title}</li>
                  <li><strong>Company:</strong> ${company}</li>
                  <li><strong>Location:</strong> ${location}</li>
                  <li><strong>Type:</strong> ${type}</li>
                  <li><strong>Posted by:</strong> ${jobPoster?.fullname || "Unknown"}</li>
                </ul>
              </div>
              
              <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #28a745; margin-top: 0;">✅ Your Matching Skills</h4>
                <p style="font-weight: bold; color: #28a745;">${matchedSkills.join(", ")}</p>
                
                <h4 style="color: #6c757d; margin-bottom: 5px;">📋 All Required Skills</h4>
                <p style="color: #6c757d;">${requiredSkills.join(", ")}</p>
              </div>
              
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <h4 style="color: #856404; margin-top: 0;">Job Description</h4>
                <p style="color: #856404; white-space: pre-wrap;">${description}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="font-size: 18px; color: #007bff; font-weight: bold;">
                  Don't miss this opportunity!
                </p>
                <p>Log in to GradLink to view the full job details and apply.</p>
              </div>
              
              <p style="margin-top: 30px; color: #6c757d;">
                Best regards,<br>
                <strong>GradLink Team</strong>
              </p>
            </div>
          `;

          try {
            await sendMail(user.email, emailSubject, emailText, emailHtml);
          } catch (emailError) {
            console.log(`Failed to send email to ${user.email}:`, emailError);
          }
        });

        await Promise.all(emailPromises);
        console.log(`Notified ${matchingUsers.length} users about new job posting: ${title}`);
      }
    } catch (error) {
      console.log("Failed to send job notification emails:", error);
    }
  });

  return res.status(201).json(new ApiResponse(201, job, "Job posted successfully"));
});

const createJobApplication = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;
  const userApplying = req.user._id; // assuming user is authenticated and _id is available in req.user
  const resumeLocalPath = req.file?.path;
  const collegeId = req.user.college;

  if (!resumeLocalPath) {
    throw new ApiError(400, "Resume file is required");
  }

  if (!jobId) {
    throw new ApiError(400, "Job ID is required");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check if user has already applied
  const existingApplication = await JobApplication.findOne({
    job: jobId,
    appliedBy: userApplying,
  });

  if (existingApplication) {
    throw new ApiError(400, "You have already applied for this job");
  }

  const resume = await uploadPdfOnCloudinary(resumeLocalPath);
  if (!resume) {
    throw new ApiError(400, "Resume upload failed");
  }

  const application = await JobApplication.create({
    job: jobId,
    appliedBy: userApplying,
    coverLetter: coverLetter,
    resumeUrl: resume.url,
    college: collegeId,
  });

  // Add user to job applicants list
  await Job.findByIdAndUpdate(jobId, {
    $addToSet: { applicants: userApplying },
  });

  setImmediate(async () => {
    try {
      const jobPoster = await User.findById(job.postedBy).select("email fullname");
      const applicant = await User.findById(userApplying).select("email fullname graduationYear major");

      if (jobPoster && jobPoster.email) {
        const emailSubject = `New Job Application: ${job.title} at ${job.company}`;
        const emailText = `
          Dear ${jobPoster.fullname},

          You have received a new job application for the position "${job.title}" at ${job.company}.

          Applicant Details:
          - Name: ${applicant.fullname}
          - Email: ${applicant.email}
          - Graduation Year: ${applicant.graduationYear}
          - Major: ${applicant.major}

          Cover Letter:
          ${coverLetter || "No cover letter provided"}

          Resume URL: ${resume.url}

          You can review this application in your GradLink dashboard.

          Best regards,
          GradLink Team
        `;

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Job Application Received</h2>
            
            <p>Dear <strong>${jobPoster.fullname}</strong>,</p>
            
            <p>You have received a new job application for the position "<strong>${job.title}</strong>" at <strong>${job.company}</strong>.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Applicant Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Name:</strong> ${applicant.fullname}</li>
                <li><strong>Email:</strong> ${applicant.email}</li>
                <li><strong>Graduation Year:</strong> ${applicant.graduationYear}</li>
                <li><strong>Major:</strong> ${applicant.major}</li>
              </ul>
            </div>
            
            ${
              coverLetter
                ? `
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Cover Letter:</h3>
                <p style="white-space: pre-wrap;">${coverLetter}</p>
              </div>
            `
                : "<p><em>No cover letter provided</em></p>"
            }
            
            <p><strong>Resume:</strong> <a href="${resume.url}" target="_blank" style="color: #007bff;">View Resume</a></p>
            
            <p style="margin-top: 30px;">You can review this application in your GradLink dashboard.</p>
            
            <p>Best regards,<br>
            <strong>GradLink Team</strong></p>
          </div>
        `;

        await sendMail(jobPoster.email, emailSubject, emailText, emailHtml);
      }
    } catch (emailError) {
      console.log("Failed to send email notification:", emailError);
    }
  });

  return res.status(201).json(new ApiResponse(201, application, "Job application submitted successfully"));
});

const getCurrentUserProfileData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  } // this error wont happen as already checked in verifyJwt

  let user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const donations = await Donation.aggregate([
    { $match: { donor: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "null",
        totalDonations: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const jobPostings = await Job.countDocuments({ postedBy: userId });

  const donationCount = donations[0]?.totalDonations || 0;
  const totalDonatedAmount = donations[0]?.totalAmount || 0;

  const badges = {
    firstDonation: donationCount > 0,
    generousDonor: donationCount >= 5,
    topSupporter: totalDonatedAmount >= 10000,
    jobPioneer: jobPostings > 0,
    activeRecruiter: jobPostings >= 10,
    hiringChampion: jobPostings >= 50,
  };

  const userWithBadges = {
    ...user.toObject(),
    badges,
    stats: {
      donationCount,
      totalDonatedAmount,
      jobPostings,
    },
  };

  return res.status(200).json(new ApiResponse(200, userWithBadges, "User profile data retrieved successfully"));
});

const getOtherUserProfileData = asyncHandler(async (req, res) => {
  const { otherUserId } = req.params;

  if (!otherUserId) {
    throw new ApiError(400, "User ID is required");
  }

  if (!mongoose.isValidObjectId(otherUserId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const user = await User.findById(otherUserId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.college.toString() != req.user.college.toString()) {
    throw new ApiError(403, "You are not allowed to access this user's profile data");
  }

  return res.status(200).json(new ApiResponse(200, user, "User profile data retrieved successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const userDetails = req.body;
  if (req.body._id != req.user._id) {
    throw new ApiError(403, "You are not authorized to update this account");
  }

  const updatedDetails = await User.findByIdAndUpdate(req.body._id, userDetails);
  res.status(200).json(new ApiResponse(200, updatedDetails, "Updated success"));
});

const getJobPostings = asyncHandler(async (req, res) => {
  const { search, type, location, currentPage = 2, limit = 5 } = req.body;
  const response = await User.findById(req.user._id).select("-password -refreshToken -role");
  const userSkills = response.skills || [];
  const matchstage = {
    college: req.user.college,
  };
  const skip = (parseInt(currentPage) - 1) * parseInt(limit);

  if (search) {
    const searchRegex = new RegExp(search, "i"); // case-insensitive search
    matchstage.$or = [{ title: searchRegex }, { description: searchRegex }, { company: searchRegex }];
  }
  if (type) {
    matchstage.type = type;
  }
  if (location) {
    matchstage.location = location;
  }

  if (currentPage < 1 || limit < 1) {
    throw new ApiError(400, "Invalid pagination parameters");
  }
  if (isNaN(currentPage) || isNaN(limit)) {
    throw new ApiError(400, "Pagination parameters must be numbers");
  }

  const totalCount = await Job.countDocuments(matchstage);
  const aggregate = await Job.aggregate([
    {
      $match: matchstage,
    },
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedByDetails",
      },
    },
    {
      $addFields: {
        matchCount: {
          $size: {
            $filter: {
              input: "$requiredSkills",
              as: "skill",
              cond: {
                $in: ["$$skill", userSkills.map((skill) => skill.toLowerCase())],
              },
            },
          },
        },
        isAlreadyApplied: {
          $cond: {
            if: { $in: [req.user._id, "$applicants"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        title: 1,
        company: 1,
        description: 1,
        requiredSkills: 1,
        type: 1,
        location: 1,
        postedByDetails: {
          _id: "$postedByDetails._id",
          fullname: "$postedByDetails.fullname",
          avatar: "$postedByDetails.avatar",
        },
        createdAt: 1,
        updatedAt: 1,
        matchCount: 1,
        isAlreadyApplied: 1,
      },
    },
    {
      $sort: { matchCount: -1, createdAt: -1 }, // sort by creation date, most recent first
    },
    {
      $skip: skip, // skip documents for pagination
    },
    {
      $limit: parseInt(limit), // limit the number of documents returned
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs: aggregate,
        currentPage: parseInt(currentPage),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / limit),
      },
      "Job postings retrieved successfully"
    )
  );
});

const getJobById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.isValidObjectId(jobId)) {
    throw new ApiError(400, "Invalid job ID format");
  }

  const job = await Job.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(jobId), college: req.user.college },
    },
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedByDetails",
      },
    },
    {
      $project: {
        title: 1,
        company: 1,
        description: 1,
        requiredSkills: 1,
        type: 1,
        location: 1,
        postedByDetails: {
          _id: 1,
          fullname: 1,
          avatar: 1,
        },
        createdAt: 1,
        updatedAt: 1,
        isAlreadyApplied: { $in: [req.user._id, "$applicants"] },
      },
    },
  ]);

  if (!job || job.length === 0) {
    throw new ApiError(404, "Job not found");
  }
  return res.status(200).json(new ApiResponse(200, job[0], "Job details retrieved successfully"));
});

const getMyJobPostings = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, search = "" } = req.query;
  const limit = 10;
  const skip = (parseInt(page) - 1) * limit;

  const query = {
    postedBy: userId,
  };

  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [{ title: searchRegex }, { company: searchRegex }, { description: searchRegex }];
  }

  const totalCount = await Job.countDocuments(query);

  const jobs = await Job.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: "jobapplications",
        localField: "_id",
        foreignField: "job",
        as: "applications",
      },
    },
    {
      $addFields: {
        applicantsCount: { $size: "$applicants" },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs,
        currentPage: parseInt(page),
        limit,
        pages: Math.ceil(totalCount / limit),
      },
      "My job postings retrieved successfully"
    )
  );
});

const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(jobId)) {
    throw new ApiError(400, "Invalid job ID format");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.postedBy.toString() !== userId.toString()) {
    throw new ApiError(403, "You do not have permission to delete this job");
  }

  await JobApplication.deleteMany({ job: jobId });

  await Job.findByIdAndDelete(jobId);

  return res.status(200).json(new ApiResponse(200, null, "Job and related applications deleted successfully"));
});

const getJobApplications = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  if (!mongoose.isValidObjectId(jobId)) {
    throw new ApiError(404, "Not a valid object id");
  }
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "This Job does not exist");
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to access this information");
  }

  const aggregate = await JobApplication.aggregate([
    {
      $match: {
        job: new mongoose.Types.ObjectId(jobId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "appliedBy",
        foreignField: "_id",
        as: "appliedByDetails",
      },
    },
    {
      $addFields: {
        appliedByDetails: {
          $arrayElemAt: ["$appliedByDetails", 0],
        },
      },
    },
    {
      $project: {
        job: 1,
        appliedBy: 1,
        status: 1,
        coverLetter: 1,
        resumeUrl: 1,
        appliedByDetails: {
          _id: "$appliedByDetails._id",
          fullname: "$appliedByDetails.fullname",
          avatar: "$appliedByDetails.avatar",
          graduationYear: "$appliedByDetails.graduationYear",
          major: "$appliedByDetails.major",
          skills: "$appliedByDetails.skills",
          email: "$appliedByDetails.email",
        },
        matchedSkills: 1,
        requiredSkills: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  const jobRequiredSkills = job.requiredSkills || [];

  const applications = aggregate.map((app) => {
    const userSkills = app.appliedByDetails?.skills || [];
    const matchedSkills = userSkills.filter((skill) => jobRequiredSkills.includes(skill));

    return {
      ...app,
      matchedSkills,
      requiredSkills: jobRequiredSkills,
    };
  });

  if (aggregate.length === 0) {
    return res.status(404).json(new ApiResponse(404, [], "No applications found for this job"));
  }
  return res.status(200).json(new ApiResponse(200, applications, "Job applications retrieved successfully"));
});

const updateJobApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId, status } = req.body;
  if (!mongoose.isValidObjectId(applicationId)) {
    throw new ApiError(400, "Invalid application ID format");
  }
  const application = await JobApplication.findById(applicationId);
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  const job = await Job.findById(application.job);

  if (!job) {
    throw new ApiError(404, "Job not found for this application");
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to update this application");
  }
  if (!["accepted", "rejected", "pending"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }
  application.status = status;
  await application.save();
  return res.status(200).json(new ApiResponse(200, status, "Application status updated successfully"));
});

const getUserJobApplications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const applications = await JobApplication.aggregate([
    {
      $match: {
        appliedBy: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "job",
        foreignField: "_id",
        as: "jobDetails",
      },
    },
    {
      $addFields: {
        jobDetails: {
          $arrayElemAt: ["$jobDetails", 0],
        },
      },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, applications, "User job applications fetched successfully"));
});

const getUsers = asyncHandler(async (req, res) => {
  const { search, graduationYear, major, page = 1, limit = 30 } = req.body;
  const matchstage = {
    college: req.user.college,
  };
  if (graduationYear) {
    matchstage.graduationYear = graduationYear;
  }
  if (major) {
    matchstage.major = major;
  }

  if (search) {
    const searchRegex = new RegExp(search, "i");
    matchstage.$or = [{ fullname: searchRegex }, { company: searchRegex }];
  }

  const aggregate = User.aggregate([
    {
      $match: matchstage,
    },
    {
      $project: {
        _id: 1,
        role: 1,
        email: 1,
        fullname: 1,
        graduationYear: 1,
        major: 1,
        skills: 1,
        company: 1,
        avatar: 1,
        location: 1,
        position: 1,
      },
    },
  ]);

  if (aggregate.length === 0) {
    return res.status(200).json(new ApiResponse(404, [], "No users found for the given criteria"));
  }

  const users = await User.aggregatePaginate(aggregate, {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

const createFundraiser = asyncHandler(async (req, res) => {
  const { title, description, category, targetAmount } = req.body;
  if (!title || !description || !category || !targetAmount) {
    throw new ApiError(400, "All fields are required");
  }
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is required");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage?.url) {
    throw new ApiError(400, "Cover image upload failed");
  }
  const fundraiser = await Fundraiser.create({
    college: req.user.college,
    title: title.trim(),
    description: description.trim(),
    category: category.trim(),
    targetAmount: targetAmount,
    coverImage: coverImage.url,
  });
  if (!fundraiser) {
    throw new ApiError(500, "Fundraiser creation failed");
  }
  return res.status(201).json(new ApiResponse(201, fundraiser, "Fundraiser created successfully"));
});

const getFundraisers = asyncHandler(async (req, res) => {
  const college = req.user.college;

  const fundraisers = await Fundraiser.aggregate([
    {
      $match: {
        college: new mongoose.Types.ObjectId(college),
      },
    },
    {
      $lookup: {
        from: "donations",
        localField: "_id",
        foreignField: "fundraiser",
        as: "donations",
      },
    },
    {
      $addFields: {
        donationsCount: { $size: "$donations" },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        category: 1,
        targetAmount: 1,
        currentAmount: 1,
        coverImage: 1,
        createdAt: 1,
        updatedAt: 1,
        donationsCount: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  if (!fundraisers || fundraisers.length === 0) {
    return res.status(404).json(new ApiResponse(404, [], "No fundraisers found for this college"));
  }
  return res.status(200).json(new ApiResponse(200, fundraisers, "Fundraisers fetched successfully"));
});

const createPost = asyncHandler(async (req, res) => {
  const college = req.user.college;
  const { content, category } = req.body;
  const mediaLocalPath = req.file?.path;
  let media = null;
  if (!content) {
    throw new ApiError(400, "Content and category are required");
  }

  if (mediaLocalPath) {
    media = await uploadOnCloudinary(mediaLocalPath);
    if (!media?.url) {
      throw new ApiError(400, "Media upload failed");
    }
  } else {
    media = { url: null };
  }

  const post = await Post.create({
    college: college,
    author: req.user._id,
    content: content.trim(),
    category: category.trim(),
    media: media.url,
  });
  if (!post) {
    throw new ApiError(500, "Post creation failed");
  }
  return res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

const getPosts = asyncHandler(async (req, res) => {
  const college = req.user.college;
  const userId = req.user._id;
  const { category, page = 1, limit = 10, myPostsOnly = false } = req.body;
  const matchstage = {
    college: college,
  };

  if (category) {
    matchstage.category = category;
  }

  if (myPostsOnly) {
    matchstage.author = new mongoose.Types.ObjectId(userId);
  }

  const aggregate = Post.aggregate([
    {
      $match: matchstage,
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    {
      $addFields: {
        commentsCount: { $size: "$comments" },
        likesCount: { $size: "$likes" },
        isLikedByUser: {
          $in: [userId, "$likes"],
        },
        isAuthor: {
          $eq: ["$author", new mongoose.Types.ObjectId(userId)],
        },
        authorDetails: {
          $arrayElemAt: ["$authorDetails", 0],
        },
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        category: 1,
        media: 1,
        createdAt: 1,
        updatedAt: 1,
        commentsCount: 1,
        likesCount: 1,
        isLikedByUser: 1,
        isAuthor: 1,
        authorDetails: {
          _id: "$authorDetails._id",
          fullname: "$authorDetails.fullname",
          avatar: "$authorDetails.avatar",
        },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  const posts = await Post.aggregatePaginate(aggregate, { page, limit });

  return res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  if (post.college.toString() !== req.user.college.toString()) {
    throw new ApiError(403, "You are not allowed to like this post");
  }
  const userId = req.user._id;
  const isLiked = post.likes.includes(userId);
  if (isLiked) {
    post.likes = post.likes.filter((like) => like.toString() !== userId.toString());
  } else {
    post.likes.push(userId);
  }
  await post.save();
  return res
    .status(200)
    .json(new ApiResponse(200, post, isLiked ? "Post unliked successfully" : "Post liked successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { content, postId } = req.body;
  if (!content || !postId) {
    throw new ApiError(400, "Content and Post ID are required");
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  if (post.college.toString() !== req.user.college.toString()) {
    throw new ApiError(403, "You are not allowed to comment on this post");
  }
  const comment = await Comment.create({
    content: content.trim(),
    post: postId,
    postedBy: req.user._id,
  });
  if (!comment) {
    throw new ApiError(500, "Comment creation failed");
  }
  return res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"));
});

const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  if (post.college.toString() !== req.user.college.toString()) {
    throw new ApiError(403, "You are not allowed to access comments for this post");
  }

  const aggregate = await Comment.aggregate([
    {
      $match: {
        post: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedByDetails",
      },
    },
    {
      $addFields: {
        postedByDetails: {
          $arrayElemAt: ["$postedByDetails", 0],
        },
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        post: 1,
        createdAt: 1,
        updatedAt: 1,
        postedByDetails: {
          _id: "$postedByDetails._id",
          fullname: "$postedByDetails.fullname",
          avatar: "$postedByDetails.avatar",
        },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  if (aggregate.length === 0) {
    return res.status(201).json(new ApiResponse(201, [], "No comments found for this post"));
  }
  return res.status(200).json(new ApiResponse(200, aggregate, "Comments fetched successfully"));
});

// TODO will later see if should separate this into different apis
const getCollegeStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ college: req.user.college });
  const totalAlumni = await User.countDocuments({ college: req.user.college, role: "alumni" });
  const totalStudents = await User.countDocuments({ college: req.user.college, role: "student" });
  const totalJobs = await Job.countDocuments({ college: req.user.college });
  const totalFundraisers = await Fundraiser.countDocuments({ college: req.user.college });
  const totalPosts = await Post.countDocuments({ college: req.user.college });
  const majors = await College.findById(req.user.college).select("majors");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        totalAlumni,
        totalStudents,
        totalJobs,
        totalFundraisers,
        totalPosts,
        majors: majors.majors || [],
      },
      "College stats fetched successfully"
    )
  );
});

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { fundraiserId, amount } = req.body;

  if (!fundraiserId || !amount) {
    throw new ApiError(400, "Fundraiser ID and amount are required");
  }

  if (amount <= 0) {
    throw new ApiError(400, "Amount must be greater than 0");
  }

  if (!mongoose.isValidObjectId(fundraiserId)) {
    throw new ApiError(400, "Invalid fundraiser ID format");
  }

  const fundraiser = await Fundraiser.findById(fundraiserId);
  if (!fundraiser) {
    throw new ApiError(404, "Fundraiser not found");
  }

  if (fundraiser.college.toString() !== req.user.college.toString()) {
    throw new ApiError(403, "You are not allowed to donate to this fundraiser");
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "inr",
      metadata: {
        fundraiserId: fundraiserId,
        userId: req.user._id.toString(),
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { clientSecret: paymentIntent.client_secret }, "Payment intent created successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to create payment intent");
  }
});

const saveDonation = asyncHandler(async (req, res) => {
  const { fundraiserId, amount, paymentIntentId } = req.body;
  if (!fundraiserId || !amount || !paymentIntentId) {
    throw new ApiError(400, "Fundraiser ID, amount, and payment intent ID are required");
  }

  // Verify the payment intent status with Stripe
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      throw new ApiError(400, "Payment has not been completed successfully");
    }

    // Verify the amount matches
    if (paymentIntent.amount !== amount * 100) {
      throw new ApiError(400, "Payment amount doesn't match the donation amount");
    }
  } catch (error) {
    throw new ApiError(500, `Failed to verify payment intent: ${error.message}`);
  }

  const donation = await Donation.create({
    fundraiser: fundraiserId,
    donor: req.user._id,
    amount: amount,
    paymentIntentId: paymentIntentId,
    college: req.user.college,
  });

  if (!donation) {
    throw new ApiError(500, "Failed to save donation");
  }

  // Update the fundraiser's total amount raised
  await Fundraiser.findByIdAndUpdate(fundraiserId, {
    $inc: { currentAmount: amount },
  });

  return res.status(201).json(new ApiResponse(201, donation, "Donation saved successfully"));
});

const getMyDonations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const donations = await Donation.aggregate([
    {
      $match: {
        donor: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "fundraisers",
        localField: "fundraiser",
        foreignField: "_id",
        as: "fundraiserDetails",
      },
    },
    {
      $addFields: {
        fundraiserDetails: {
          $arrayElemAt: ["$fundraiserDetails", 0],
        },
      },
    },
    {
      $project: {
        _id: 1,
        amount: 1,
        paymentIntentId: 1,
        createdAt: 1,
        updatedAt: 1,
        fundraiserDetails: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, donations, "My donations fetched successfully"));
});

const getHomePageData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const collegeId = req.user.college;

  const jobsPromise = Job.find({ college: collegeId })
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("postedBy", "fullname avatar position company");
  const postsPromise = Post.find({ college: collegeId })
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("author", "fullname avatar");
  const donationsPromise = Donation.find({ college: collegeId })
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("fundraiser", "title coverImage")
    .populate("donor", "fullname avatar");

  const totalUsersPromise = User.countDocuments({ college: collegeId });
  const totalAlumniPromise = User.countDocuments({ college: collegeId, role: "alumni" });
  const totalStudentsPromise = User.countDocuments({ college: collegeId, role: "student" });
  const totalJobsPromise = Job.countDocuments({ college: collegeId });
  const totalPostsPromise = Post.countDocuments({ college: collegeId });
  const totalDonationsPromise = Donation.countDocuments({ college: collegeId });

  const [jobs, posts, donations, totalUsers, totalAlumni, totalStudents, totalJobs, totalPosts, totalDonations] =
    await Promise.all([
      jobsPromise,
      postsPromise,
      donationsPromise,
      totalUsersPromise,
      totalAlumniPromise,
      totalStudentsPromise,
      totalJobsPromise,
      totalPostsPromise,
      totalDonationsPromise,
    ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: req.user,
        jobs,
        posts,
        donations,
        networkStats: {
          totalUsers,
          totalAlumni,
          totalStudents,
          totalJobs,
          totalPosts,
          totalDonations,
        },
      },
      "Home page data fetched successfully"
    )
  );
});

const getMajors = asyncHandler(async (req, res) => {
  const college = await College.findById(req.user.college).select("majors");
  if (!college) {
    throw new ApiError(404, "College not found");
  }
  return res.status(200).json(new ApiResponse(200, college.majors, "Majors fetched successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post ID format");
  }
  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to delete this post");
  }
  await Post.findByIdAndDelete(postId);
  await Comment.deleteMany({ post: postId });
  return res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
});

const changeAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar?.url) {
    throw new ApiError(500, "Avatar upload failed");
  }
  const updatedUser = await User.findByIdAndUpdate(req.user._id, { avatar: avatar.url });
  if (!updatedUser) {
    throw new ApiError(500, "Failed to update avatar");
  }
  return res.status(200).json(new ApiResponse(200, avatar.url, "Avatar updated successfully"));
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  createJobPosting,
  createJobApplication,
  getCurrentUserProfileData,
  getOtherUserProfileData,
  updateAccountDetails,
  getJobPostings,
  getJobById,
  getMyJobPostings,
  deleteJob,
  getJobApplications,
  updateJobApplicationStatus,
  getUserJobApplications,
  getUsers,
  registerCollegeandAdmin,
  createFundraiser,
  getAllCollege,
  getFundraisers,
  createPost,
  getPosts,
  toggleLike,
  addComment,
  getComments,
  getCollegeStats,
  createPaymentIntent,
  saveDonation,
  getMyDonations,
  getHomePageData,
  getMajors,
  deletePost,
  changeAvatar,
};
