import express, { Request, Response } from "express";
import { createAccomodation } from "../controllers/accomodation.controller";
import verifyUser from "../utils/verifyUser";

const accomodationRouter = express.Router();

accomodationRouter.post("/createProperty", createAccomodation);

export default accomodationRouter;
