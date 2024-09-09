import express, { Request, Response } from "express";
import verifyUser from "../utils/verifyUser";
import { createBooking } from "../controllers/bookings.controller";

const bookingsRouter = express.Router();

bookingsRouter.post("/createBookings", createBooking);

export default bookingsRouter;
