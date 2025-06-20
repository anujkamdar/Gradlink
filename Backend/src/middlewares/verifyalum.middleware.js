import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const verifyAlum = asyncHandler(async (req, res, next) => {
  try {
    const role = req.user?.role;
    if (role !== "alumni") {
      throw new ApiError(402, "Unauthorized access, Alum role is required");
    }
    next();
  } catch (error) {
    throw new ApiError(402, error.message || "Invalid Alum Access");
  }
});
