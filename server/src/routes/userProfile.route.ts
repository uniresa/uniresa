import express, { Express, Request, Response } from "express";
import {
  createUserProfile,
  getUserProfile,
} from "../controllers/userProfile.controller";
import verifyUser from "../utils/verifyUser";

const userProfileRouter = express.Router();

userProfileRouter.post("/create", createUserProfile);
userProfileRouter.get("/get/:id", verifyUser, getUserProfile);

export default userProfileRouter;
