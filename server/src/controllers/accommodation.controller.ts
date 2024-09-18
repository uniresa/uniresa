import { Request, Response, NextFunction } from "express";
import {
  AccommodationProperty,
  AvailabilityDetails,
  BookingDetails,
  Review,
  RoomType,
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
    numberOfReviews: accommodation.numberOfReviews || 0,
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

export const createAccommodation = async (req: Request, res: Response) => {
  const accomodationInput: Partial<AccommodationProperty> =
    req.body as AccommodationProperty;

  // Set default values for optional fields
  const newAccommodation = setDefaultAccommodationValues(accomodationInput);

  try {
    // Check if a property with the same name already exists in the database
    const existingPropertyName = await db
      .collection("accommodations")
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
      .collection("accommodations")
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
      .collection("accommodations")
      .doc(newAccommodation.propertyId);

    const filteredAccommodation = removeUndefinedFields({
      ...newAccommodation,
      // Exclude subcollection data from the main Collection document
      propertyAvailabilities: undefined,
      propertyBookings: undefined,
      //   roomTypes: undefined,
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
          reviewId: specificReviewId.id,
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
        await specificRoomId.set({ ...roomType, roomId: specificRoomId.id });

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
export const getSingleAccommodation = async (req: Request, res: Response) => {
  try {
    const accommodationId = req.params.propertyId;
    console.log(accommodationId);
    const accommodationRef = db
      .collection("accommodations")
      .doc(accommodationId);
    const accommodationData = await accommodationRef.get();

    if (!accommodationData.exists) {
      return res.status(404).json({
        status: "failed",
        message: "le logement n'existe pas dans notre base de données",
      });
    }
    const accommodation = accommodationData.data() as AccommodationProperty;

    // Fetch subcollection data concurrently
    const [propertyBookingsSnapshot, reviewsSnapshot, roomTypesSnapshot] =
      await Promise.all([
        accommodationRef.collection("propertyBookings").get(),
        accommodationRef.collection("reviews").get(),
        accommodationRef.collection("roomTypes").get(),
      ]);
    // Map subcollection data to appropriate fields
    accommodation.propertyBookings = propertyBookingsSnapshot.docs.map(
      (doc) => doc.data() as BookingDetails
    );

    accommodation.reviews = reviewsSnapshot.docs.map(
      (doc) => doc.data() as Review
    );
    accommodation.roomTypes = roomTypesSnapshot.docs.map(
      (doc) => doc.data() as RoomType
    );

    // Fetch room availabilities concurrently
    const roomAvailabilitiesPromises = accommodation.roomTypes.map(
      async (roomType) => {
        const roomAvailabilitiesSnapshot = await accommodationRef
          .collection("roomTypes")
          .doc(roomType.roomId)
          .collection("roomAvailabilities")
          .get();
        return roomAvailabilitiesSnapshot.docs
          .map((doc) => doc.data() as AvailabilityDetails)
          .filter((availability) => availability.isAvailable); // Filter for available rooms
      }
    );
    // Resolve all room availabilities promises
    const allRoomAvailabilities = await Promise.all(roomAvailabilitiesPromises);
    // Flatten the room availabilities array
    accommodation.propertyAvailabilities = allRoomAvailabilities.flat();

    return res.status(200).json({
      status: "success",
      message: "Logement récupéré avec succès.",
      data: accommodation,
    });
  } catch (error) {
    console.error("Error getting accommodation:", error);
    return res.status(500).json({
      status: "failed",
      message: "Erreur lors de la récupération du logement",
      error,
    });
  }
};
export const getAllAccommodations = async (req: Request, res: Response) => {
  try {
    const accommodationRef = db.collection("accommodations");
    const accommodationsSnapshot = await accommodationRef.get();
    const accommodations = accommodationsSnapshot.docs.map(
      (doc) => doc.data() as AccommodationProperty
    );

    // Fetch all subcollection data concurrently for performance
    const [propertyBookingsSnapshots, reviewsSnapshots, roomTypesSnapshots] =
      await Promise.all([
        Promise.all(
          accommodations.map((acc) =>
            accommodationRef
              .doc(acc.propertyId)
              .collection("propertyBookings")
              .get()
          )
        ),
        Promise.all(
          accommodations.map((acc) =>
            accommodationRef.doc(acc.propertyId).collection("reviews").get()
          )
        ),
        Promise.all(
          accommodations.map((acc) =>
            accommodationRef.doc(acc.propertyId).collection("roomTypes").get()
          )
        ),
      ]);

    // Map subcollection data to appropriate fields
    accommodations.forEach((accommodation, index) => {
      // Set property bookings
      accommodation.propertyBookings = propertyBookingsSnapshots[
        index
      ].docs.map((doc) => doc.data() as BookingDetails);

      // Set reviews
      accommodation.reviews = reviewsSnapshots[index].docs.map(
        (doc) => doc.data() as Review
      );

      // Set room types and calculate discount percentages
      accommodation.roomTypes = roomTypesSnapshots[index].docs.map((doc) => {
        const roomType = doc.data() as RoomType;

        // Variable to store discount percentages for the roomType
        const ongoingDiscountPercentages: number[] = [];

        // Calculate the discount percentages for the ongoing discount campaigns
        const today = new Date();
        const activeDiscounts = roomType.discountList.filter(
          (discount) =>
            discount.isActive &&
            discount.discountType === "percentage" &&
            discount.startDate <= today &&
            discount.endDate >= today
        );

        // Store each active discount percentage in the array
        activeDiscounts.forEach((discount) => {
          ongoingDiscountPercentages.push(discount.discountPercentage);
        });

        // Attach ongoing discounts to the roomType object
        roomType.ongoingDiscountPercentages = ongoingDiscountPercentages;

        return roomType;
      });
    });

    // Fetch room availabilities concurrently for all room types
    const roomAvailabilitiesPromises = accommodations.flatMap((accommodation) =>
      accommodation.roomTypes.map(async (roomType) => {
        const roomAvailabilitiesSnapshot = await accommodationRef
          .doc(accommodation.propertyId)
          .collection("roomTypes")
          .doc(roomType.roomId)
          .collection("roomAvailabilities")
          .get();
        roomType.roomAvailabilities = roomAvailabilitiesSnapshot.docs
          .map((doc) => doc.data() as AvailabilityDetails)
          .filter((availability) => availability.isAvailable); // Filter for available rooms
      })
    );

    // Wait for all room availabilities to be fetched
    await Promise.all(roomAvailabilitiesPromises);

    return res.status(200).json({
      status: "success",
      message: "Tous les logements récupérés avec succès.",
      data: accommodations,
    });
  } catch (error: any) {
    console.error("Error getting all accommodations:", error);
    return res.status(500).json({
      status: "failed",
      message: "Erreur lors de la récupération des logements.",
      error: error.message,
    });
  }
};
