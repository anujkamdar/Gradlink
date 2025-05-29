import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/register", upload.single("avatar"), registerUser);


export default userRouter;
