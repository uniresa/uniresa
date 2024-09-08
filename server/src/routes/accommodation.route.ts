import express, { Request, Response } from "express";
import { createAccommodation } from "../controllers/accommodation.controller";
import verifyUser from "../utils/verifyUser";

const accomodationRouter = express.Router();

accomodationRouter.post("/createProperty", createAccommodation);

export default accomodationRouter;
