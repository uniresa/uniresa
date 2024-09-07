import { Request, Response, NextFunction } from "express";
import {
  AccommodationProperty,
  AvailabilityDetails,
} from "../typesDeclaration/types";
import { db } from "../../firebaseConfig";
import { GenerateCustomID } from "../utils/customIdGenerator";

// Implement the createAccommodationProperty function to create a new accommodation property in Firestore Database.
const removeUndefinedFields = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
};
// Set default values for optional fields in AccommodationProperty
const setDefaultAccommodationValues = (
  accommodation: Partial<AccommodationProperty>
): AccommodationProperty => {
  return {
    propertyId: GenerateCustomID(10), // Generate a unique ID based on timestamp
    propertyName: accommodation.propertyName || "Default Property Name",
    propertyType: accommodation.propertyType || "Hotel",
    description: accommodation.description || "No description provided.",
    location: accommodation.location || {
      street: "",
      quartier: "",
      city: "",
      district: "",
      region: "",
      postalCode: "",
      country: "",
      latitude: 0, // Geographical latitude
      longitude: 0,
    },
    images: accommodation.images || [],
    amenities: accommodation.amenities || {
      freeWiFi: false,
      parking: false,
      swimmingPool: false,
      airConditioning: false,
      kitchen: false,
      privateBathroom: false,
      balcony: false,
      petFriendly: false,
      breakfastIncluded: false,
      gym: false,
      laundryService: false,
    },
    policies: accommodation.policies || {
      isSmokingAllowed: false,
      isPetsAllowed: false,
      childrenAllowed: false,
      additionalPolicies: "",
    },
    checkInDetails: accommodation.checkInDetails || {
      checkInFrom: "14:00",
      checkInTo: "20:00",
      checkOutFrom: "07:00",
      checkOutTo: "12:00",
    },
    priceDetails: accommodation.priceDetails || {
      pricePerNight: 0,
      currency: "Fcfa",
    },
    finalCleaning: accommodation.finalCleaning || {
      finalCleaningincluded: true,
      cleaningFee: 0,
      currency: "Fcfa",
    },
    numberOfStars: accommodation.numberOfStars || 0, // Default rating to 0
    reviews: accommodation.reviews || [],
    propertyAvailabilities: accommodation.propertyAvailabilities || [],
    roomTypes: accommodation.roomTypes || [],
    propertyBookings: accommodation.propertyBookings || [],
    distanceFromCityCenter: accommodation.distanceFromCityCenter || 0,
    distanceFromSea: accommodation.distanceFromSea || 0,
    popularFacilities: accommodation.popularFacilities || [],
    hostDetails: accommodation.hostDetails || {
      hostName: "N/A", // Name of the host or manager
      contactNumber: "N/A", // Contact phone number
      email: "N/A",
      hostRating: 0,
      responseRate: "N/A",
    },
    nearbyAttractions: accommodation.nearbyAttractions || [],
    healthAndSafetyMeasures: accommodation.healthAndSafetyMeasures || {
      enhancedCleaning: false,
      contactlessCheckIn: false,
      handSanitizerAvailable: false,
    },
    cancellationPolicy: accommodation.cancellationPolicy || "24 hours",
    keyCollection: accommodation.keyCollection || {
      toBeCollectedInProperty: true,
      address: "",
      contactNumber: "",
      email: "",
      code: "",
      keyHolderName: "",
      details: "",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const createAccomodation = async (req: Request, res: Response) => {
  const accomodationInput: Partial<AccommodationProperty> =
    req.body as AccommodationProperty;

  // Set default values for optional fields
  const newAccommodation = setDefaultAccommodationValues(accomodationInput);

  try {
    // Check if a property with the same name already exists in the database
    const existingPropertyName = await db
      .collection("accomodations")
      .where("propertyName", "==", newAccommodation.propertyName)
      .limit(1)
      .get();

    if (!existingPropertyName.empty) {
      return res.status(400).json({
        status: "failed",
        message:
          "Le logement a déja été enregistré. Verifiez le nom du logement",
      });
    }
    // Check if a property with the same propertyId already exists in the database
    const existingPropertyId = await db
      .collection("accomodations")
      .where("propertyId", "==", newAccommodation.propertyId)
      .limit(1)
      .get();

    if (!existingPropertyId.empty) {
      return res.status(400).json({
        status: "failed",
        message:
          "Le logement a déja été enregistré. Verifiez le numero de reference",
      });
    }

    const accommodationRef = db
      .collection("accomodations")
      .doc(newAccommodation.propertyId);

    const filteredAccommodation = removeUndefinedFields({
      ...newAccommodation,
      // Exclude subcollection data from the main Collection document
      propertyAvailabilities: undefined,
      propertyBookings: undefined,
      roomTypes: undefined,
      reviews: undefined,
    });
    await accommodationRef.set(filteredAccommodation);

    // Reviews subcollection
    const reviewsRef = accommodationRef.collection("reviews");
    if (newAccommodation.reviews?.length) {
      for (const review of newAccommodation.reviews) {
        const specificReviewId = reviewsRef.doc(GenerateCustomID(300));
        await specificReviewId.set({
          ...review,
          reviewId: specificReviewId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } else {
      await reviewsRef.doc(GenerateCustomID("initial")).set({
        Review: [],
      });
    }

    //bookings subCollection
    const propertyBookingsRef = accommodationRef.collection("propertyBookings");
    if (
      newAccommodation.propertyBookings &&
      newAccommodation.propertyBookings.length > 0
    ) {
      for (const booking of newAccommodation.propertyBookings) {
        await propertyBookingsRef.doc(GenerateCustomID(700)).set(booking);
      }
    } else {
      await propertyBookingsRef.doc(GenerateCustomID("initial")).set({
        Booking: [],
      });
    }
    // roomTypes subcollection
    const roomTypesRef = accommodationRef.collection("roomTypes");
    if (newAccommodation.roomTypes?.length) {
      for (const roomType of newAccommodation.roomTypes) {
        const specificRoomId = roomTypesRef.doc(GenerateCustomID(20));
        await specificRoomId.set({ ...roomType, roomId: specificRoomId });

        //availabilities subCollection
        const roomAvailabilitiesRef =
          specificRoomId.collection("roomAvailabilities");
        if (roomType.roomAvailabilities?.length) {
          for (const availability of roomType.roomAvailabilities) {
            await roomAvailabilitiesRef
              .doc(GenerateCustomID("AV"))
              .set(availability);
          }
        } else {
          await roomAvailabilitiesRef.doc(GenerateCustomID("initial")).set({
            RoomAvailability: [],
          });
        }
      }
    } else {
      await roomTypesRef.doc(GenerateCustomID("initial")).set({
        RoomType: [],
      });
    }

    // );
    // // Add availability data if provided in the request
    // if (
    //   newAccommodation.propertyAvailabilities &&
    //   newAccommodation.propertyAvailabilities.length > 0
    // ) {
    //   for (const availability of newAccommodation.propertyAvailabilities) {
    //     await availabilityRef.doc(GenerateCustomID("AV")).set(availability);
    //   }
    // } else {
    //   // If no availability data is provided, create an empty document or handle it as needed
    //   await availabilityRef.doc(GenerateCustomID("initial")).set({
    //     Availability: [],
    //   });
    // }

    return res.status(201).json({
      status: "success",
      message: "Accommodation created successfully.",
    });
  } catch (error) {
    console.error("Error creating accommodation:", error);
    return res.status(500).json({
      status: "failed",
      message: "Error creating accommodation.",
      error,
    });
  }
};
