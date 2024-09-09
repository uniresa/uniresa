import express, { Request, Response } from "express";
import {
  createAccommodation,
  getAllAccommodations,
  getSingleAccommodation,
} from "../controllers/accommodation.controller";
import verifyUser from "../utils/verifyUser";

const accomodationRouter = express.Router();

accomodationRouter.post("/createProperty", createAccommodation);
accomodationRouter.get(
  "/getSingleAccommodation/:propertyId",
  getSingleAccommodation
);
accomodationRouter.get("/getAllAccommodations", getAllAccommodations);

export default accomodationRouter;
