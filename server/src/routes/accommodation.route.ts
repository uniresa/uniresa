import express, { Request, Response } from "express";
import {
  createAccommodation,
  getAllAccommodations,
  getSingleAccommodation,
  getSearchedAccommodations,
  updateDiscountList,
} from "../controllers/accommodation.controller";
import verifyUser from "../utils/verifyUser";

const accomodationRouter = express.Router();

accomodationRouter.post("/createProperty", createAccommodation);
accomodationRouter.get(
  "/getSingleAccommodation/:propertyId",
  getSingleAccommodation
);
accomodationRouter.get("/getAllAccommodations", getAllAccommodations);
accomodationRouter.post("/getSearchedAccomodations", getSearchedAccommodations);
accomodationRouter.put("/accommodations/:propertyId/roomTypes/:roomId/discountList", updateDiscountList);

export default accomodationRouter;
