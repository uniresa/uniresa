import { Request, Response } from "express";
import { BookingRequest, UserProfile } from "../typesDeclaration/types";
import { db } from "../../firebaseConfig";
import { checkPropertyAvailability } from "./propertiesAvailabilities.controller";
import { GenerateCustomID, genericPassword } from "../utils/customIdGenerator";
import { createUser } from "../utils/createUser";
import { parse, isValid } from "date-fns";

export const createBooking = async (req: Request, res: Response) => {
  const {
    propertyId,
    propertyName,
    // numberOfRooms,
    propertyType,
    specificRoomTypeIds,
    bookingDates,
    totalAmount,
    paidAmount,
    currency,
    paymentStatus,
    paymentMethod,
    paymentChannel,
    bookingType,
    bookingChannel,
    bookingStatus,
    specialRequests,
    bookingPerson,
  } = req.body as BookingRequest;

  if (!specificRoomTypeIds || specificRoomTypeIds.length === 0) {
    return res.status(400).json({
      status: "failed",
      message: "No specific room type(s) provided for booking.",
    });
  }

  if (!bookingPerson) {
    return res.status(400).json({
      status: "failed",
      message: "Specify the person making the booking.",
    });
  }

  // Parse dates using date-fns
  const parsedCheckInDate = parse(
    bookingDates.checkInDate,
    "MM/dd/yyyy",
    new Date()
  );
  const parsedCheckOutDate = parse(
    bookingDates.checkOutDate,
    "MM/dd/yyyy",
    new Date()
  );
  // Check if checkInDate and checkOutDate are valid
  if (!isValid(parsedCheckInDate) || !isValid(parsedCheckOutDate)) {
    return res.status(400).json({
      status: "failed",
      message:
        "Invalid date format for check-in or check-out date. Use MM/DD/YYYY format.",
    });
  }
  try {
    // Check if the user exists and create one if they don't
    let userRef: string | null = null;
    const genericPass: string = genericPassword();

    // Check for an existing user by email
    const existingEmail = await db
      .collection("users")
      .where("email", "==", bookingPerson.email)
      .limit(1)
      .get();

    if (!existingEmail.empty) {
      // User already exists; use the user ID
      userRef = existingEmail.docs[0].id;

      // Get the current address from the existing user
      const existingUserData = existingEmail.docs[0].data() as UserProfile;
      const existingAddress = existingUserData.address;

      if (existingAddress) {
        const newAddress = bookingPerson.address;
        if (
          existingAddress.street !== newAddress.street ||
          existingAddress.quartier !== newAddress.quartier ||
          existingAddress.city !== newAddress.city ||
          existingAddress.district !== newAddress.district ||
          existingAddress.region !== newAddress.region ||
          existingAddress.postalCode !== newAddress.postalCode ||
          existingAddress.country !== newAddress.country
        ) {
          // If any of the fields are different, update the user's address
          await db.collection("users").doc(userRef).update({
            address: newAddress,
          });
          console.log("User address updated.");
        }
      } else {
        // If the existing address is undefined, update the user's address
        await db.collection("users").doc(userRef).update({
          address: bookingPerson.address,
        });
        console.log("User address was undefined, now set to new address.");
      }
    } else {
      // Create a new user from booking details
      const newUserProfile: UserProfile = {
        firstName: bookingPerson.firstName,
        surName: bookingPerson.surName,
        email: bookingPerson.email,
        password: genericPass,
        phoneNumber: bookingPerson.phoneNumber,
        accountBalance: bookingPerson.accountBalance,
        notificationPreferences: {
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: false,
        },
        address: bookingPerson.address,
      };

      // Create a new user profile
      userRef = await createUser(newUserProfile);
    }

    // Check availability for each specific room type
    const isAvailable = await checkPropertyAvailability(
      propertyId,
      new Date(bookingDates.checkInDate),
      new Date(bookingDates.checkOutDate),
      specificRoomTypeIds
    );

    if (!isAvailable) {
      return res.status(400).json({
        status: "failed",
        message:
          "One or more room types are not available for the requested dates.",
      });
    }

    // All specified room types are available; proceed to create bookings
    const bookingIds: string[] = [];

    for (const roomTypeId of specificRoomTypeIds) {
      const bookingId = GenerateCustomID(70);
      bookingIds.push(bookingId);

      // Create a booking for the specific room type

      await db
        .collection("accommodations")
        .doc(propertyId)
        .collection("roomTypes")
        .doc(roomTypeId)
        .collection("roomBookings")
        .doc(bookingId)
        .set({
          bookingId,
          userId: userRef,
          bookingPerson,
          propertyId,
          propertyName,
          propertyType,
          roomTypeId,
          bookingDates,
          totalAmount,
          paidAmount,
          currency,
          bookingType,
          bookingChannel,
          bookingStatus,
          paymentStatus,
          paymentMethod,
          paymentChannel,
          specialRequests,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      // Update availability by adding the booked date range for the specific room type
      await db
        .collection("accommodations")
        .doc(propertyId)
        .collection("roomTypes")
        .doc(roomTypeId)
        .collection("roomAvailabilities")
        .doc(bookingId) // Use booking ID to create a corresponding availability document
        .set({
          startDate: bookingDates.checkInDate,
          endDate: bookingDates.checkOutDate,
        });
        
      // Add booking to propertyBookings
      await db
        .collection("accommodations")
        .doc(propertyId)
        .collection("propertyBookings")
        .doc(bookingId)
        .set({
          bookingId,
          userId: userRef,
          bookingPerson,
          propertyId,
          propertyName,
          propertyType,
          roomTypeId,
          bookingDates,
          totalAmount,
          paidAmount,
          currency,
          bookingType,
          bookingChannel,
          bookingStatus,
          paymentStatus,
          paymentMethod,
          paymentChannel,
          specialRequests,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      // Add booking to the user's booking history
      await db
        .collection("users")
        .doc(userRef)
        .collection("bookingHistory")
        .doc(bookingId)
        .set({
          bookingId,
          userId: userRef,
          bookingPerson,
          propertyId,
          propertyName,
          propertyType,
          roomTypeId,
          bookingDates,
          totalAmount,
          paidAmount,
          currency,
          bookingType,
          bookingChannel,
          bookingStatus,
          paymentStatus,
          paymentMethod,
          paymentChannel,
          specialRequests,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
    }

    return res.status(201).json({
      status: "success",
      message: "Bookings created successfully and availability updated.",
      bookingIds,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({
      status: "failed",
      message: "Error creating booking.",
      error,
    });
  }
};
