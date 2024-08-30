import express, { Express, Request, Response } from "express";
import createUserProfile from "../controllers/userProfile.controller";

const userProfileRouter = express.Router();

userProfileRouter.post("/create", createUserProfile);

export default userProfileRouter;
