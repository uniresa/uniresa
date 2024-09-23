import { Request, Response, NextFunction } from "express";
import {
  AccommodationProperty,
  AvailabilityDetails,
  BookingDetails,
  DiscountDetails,
  PriceDetails,
  SearchCriteria,
  Review,
  RoomType,
} from "../typesDeclaration/types";
import { db } from "../../firebaseConfig";
import { GenerateCustomID } from "../utils/customIdGenerator";
import { checkPropertyAvailability } from "./propertiesAvailabilities.controller";
import { parse, isValid } from "date-fns";

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
    // Save room types and their subcollections (discountList, availabilities) to subcollections
    const roomTypesRef = accommodationRef.collection("roomTypes");
    if (newAccommodation.roomTypes?.length) {
      for (const roomType of newAccommodation.roomTypes) {
        const specificRoomId = roomTypesRef.doc(GenerateCustomID(20));

        // Calculate ongoing discount percentages for the roomType
        const today = new Date();
        const ongoingDiscountPercentages = (roomType.discountList || [])
          .filter(
            (discount) =>
              discount.isActive &&
              discount.startDate <= today &&
              discount.endDate >= today
          )
          .filter((discount) => discount.discountType === "Percentage")
          .map((discount) => discount.discountValue);

        // Save the room type with discounts
        await specificRoomId.set({
          ...roomType,
          roomId: specificRoomId.id,
          ongoingDiscountPercentages,
        });

        // Save room availabilities for the room type
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

        // Save discountList as a subcollection
        const discountListRef = specificRoomId.collection("discountList");
        if (roomType.discountList?.length) {
          for (const discount of roomType.discountList) {
            const specificDiscountId = discountListRef.doc(
              GenerateCustomID(30)
            );
            await specificDiscountId.set({
              ...discount,
              discountId: specificDiscountId.id,
            });
          }
        } else {
          await discountListRef.doc(GenerateCustomID("initial")).set({
            DiscountList: [],
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

    if (accommodationsSnapshot.empty) {
      return res.status(404).json({
        status: "failed",
        message: "No accommodations found",
      });
    }

    const accommodations = accommodationsSnapshot.docs.map(
      (doc) => doc.data() as AccommodationProperty
    );

    // Fetch related data concurrently
    const [
      propertyBookingsSnapshots,
      reviewsSnapshots,
      roomTypesSnapshots,
      discountsSnapshots,
    ] = await Promise.all([
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
      Promise.all(
        accommodations.map((acc) =>
          db
            .collection("discountList")
            .where("propertyIds", "array-contains", acc.propertyId)
            .get()
        )
      ),
    ]);

    accommodations.forEach((accommodation, index) => {
      // Set property bookings
      accommodation.propertyBookings = propertyBookingsSnapshots[
        index
      ].docs.map((doc) => doc.data() as BookingDetails);

      // Set reviews
      accommodation.reviews = reviewsSnapshots[index].docs.map(
        (doc) => doc.data() as Review
      );

      // Set room types and apply discounts
      const roomTypes = roomTypesSnapshots[index].docs.map(
        (doc) => doc.data() as RoomType
      );

      // Get the relevant discounts for the accommodation
      const discounts = discountsSnapshots[index].docs.map(
        (doc) => doc.data() as DiscountDetails
      );

      roomTypes.forEach((roomType) => {
        const applicableDiscounts = discounts.filter(
          (discount) =>
            discount.isActive &&
            discount.startDate <= new Date() &&
            discount.endDate >= new Date() &&
            (!discount.roomTypeId ||
              discount.roomTypeId.includes(roomType.roomId))
        );

        roomType.ongoingDiscountPercentages = applicableDiscounts
          .filter((discount) => discount.discountType === "Percentage")
          .map((discount) => discount.discountValue);

        // Add flat fee discounts if needed
        const flatFeeDiscounts = applicableDiscounts.filter(
          (discount) => discount.discountType === "Flat Fee"
        );

        // Apply the flat fee discount logic if necessary (e.g., adjusting price)
        roomType.priceDetails = calculatePriceWithDiscounts(
          roomType.priceDetails,
          flatFeeDiscounts
        );
      });

      accommodation.roomTypes = roomTypes;
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
      message: "All accommodations retrieved successfully.",
      data: accommodations,
    });
  } catch (error: any) {
    console.error("Error getting all accommodations:", error);
    return res.status(500).json({
      status: "failed",
      message: "Error retrieving accommodations.",
      error: error.message,
    });
  }
};

// Helper function to calculate the price based on flat fee discounts
const calculatePriceWithDiscounts = (
  priceDetails: PriceDetails,
  flatFeeDiscounts: DiscountDetails[]
): PriceDetails => {
  // Apply flat fee discounts to the price, this function can be extended to handle other types of discounts
  let finalPrice = priceDetails.pricePerNight;

  flatFeeDiscounts.forEach((discount) => {
    finalPrice -= discount.discountValue;
  });

  return {
    ...priceDetails,
    finalPrice: Math.max(0, finalPrice), // Ensure the price doesn't go below 0
  };
};

export const getSearchedAccommodations = async (
  req: Request,
  res: Response
) => {
  try {
    const { destination, dates, minGuests, minRooms } =
      req.body as SearchCriteria;
    console.log(req.body);
    // Parse the dates with error handling
    let parsedCheckInDate, parsedCheckOutDate;
    try {
      parsedCheckInDate = parse(dates.checkInDate, "yyyy-MM-dd", new Date());
      parsedCheckOutDate = parse(dates.checkOutDate, "yyyy-MM-dd", new Date());
    } catch (error) {
      return res.status(400).json({
        status: "failed",
        message: 'Invalid date format. Please use "YYYY-MM-DD".',
      });
    }
    const accommodationRef = db.collection("accommodations");

    // Filter accommodations by destination
    const accommodationQuery = accommodationRef.where(
      "location.city",
      "==",
      destination.city
    );

    const accommodationsSnapshot = await accommodationQuery.get();

    if (accommodationsSnapshot.empty) {
      return res.status(404).json({
        status: "failed",
        message: "Aucun logement disponible pour cette destination.",
      });
    }

    const accommodations = accommodationsSnapshot.docs.map(
      (doc) => doc.data() as AccommodationProperty
    );
    console.log(accommodations);
    // Filter accommodations by capacity
    const filteredAccommodations: AccommodationProperty[] = [];

    for (const accommodation of accommodations) {
      const roomTypesSnapshot = await accommodationRef
        .doc(accommodation.propertyId)
        .collection("roomTypes")
        .get();

      let matchingRooms = roomTypesSnapshot.docs.map(
        (doc) => doc.data() as RoomType
      );

      // Filter rooms based on the capacity requirement
      matchingRooms = matchingRooms.filter((roomType) => {
        const totalCapacity = roomType.capacity;
        return totalCapacity >= minGuests;
      });

      // If no rooms match the capacity requirement, continue to the next accommodation
      if (matchingRooms.length === 0) {
        continue;
      }

      // // Filter accommodations by the number of rooms
      // matchingRooms = matchingRooms.filter((roomType) => {
      //   return roomType.numberOfBedrooms >= rooms; // Match rooms based on number of bedrooms
      // });

      // // If no rooms match the number of rooms requirement, continue to the next accommodation
      // if (matchingRooms.length === 0) {
      //   continue;
      // }

      // Collect specific room type IDs for availability check
      const specificRoomTypeIds = matchingRooms.map(
        (roomType) => roomType.roomId
      );

      // Check availability by calling the checkPropertyAvailability function
      const isAvailable = await checkPropertyAvailability(
        accommodation.propertyId,
        new Date(dates.checkInDate),
        new Date(dates.checkOutDate),
        specificRoomTypeIds
      );

      // If the property is not available, skip this accommodation
      if (!isAvailable) {
        continue;
      }

      // If available, add accommodation to filtered list
      accommodation.roomTypes = matchingRooms;
      filteredAccommodations.push(accommodation);
    }
    // Return the filtered accommodations or an error if no matches were found
    if (filteredAccommodations.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "Aucun logement disponible pour ces critères de recherche.",
      });
    }
    console.log(filteredAccommodations, filteredAccommodations.length);
    return res.status(200).json({
      status: "success",
      message: "Logements trouvés avec succès.",
      data: filteredAccommodations,
    });
  } catch (error: any) {
    console.error("Error getting searched accommodations:", error);
    return res.status(500).json({
      status: "failed",
      message: "Erreur lors de la récupération des logements.",
      error: error.message,
    });
  }
};

export const updateDiscountList = async (req: Request, res: Response) => {
  const { propertyId, roomId } = req.params; // assuming these are passed as parameters
  const discounts: DiscountDetails[] = req.body.discountList; // expecting an array of discounts from the request body

  try {
    // Check if the property and room exist
    const roomRef = db
      .collection("accommodations")
      .doc(propertyId)
      .collection("roomTypes")
      .doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return res.status(404).json({
        status: "failed",
        message: "Property or room not found.",
      });
    }

    // Reference to the discountList subcollection for the room
    const discountListRef = roomRef.collection("discountList");

    // If no discounts were provided, return an error
    if (!discounts || discounts.length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "No discounts provided.",
      });
    }

    // Iterate over the discounts and either update or create them
    for (const discount of discounts) {
      if (discount.discountId) {
        // If a discountId is provided, update the existing discount
        const existingDiscountRef = discountListRef.doc(discount.discountId);
        const existingDiscountDoc = await existingDiscountRef.get();

        if (existingDiscountDoc.exists) {
          // Update the discount
          await existingDiscountRef.update({
            ...discount,
            updatedAt: new Date(), // update timestamp
          });
        } else {
          // If the discountId is invalid or doesn't exist, create a new discount
          const newDiscountRef = discountListRef.doc(GenerateCustomID(25));
          await newDiscountRef.set({
            ...discount,
            discountId: newDiscountRef.id, // generate new discountId
            propertyId,
            roomTypeId: roomId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else {
        // If no discountId is provided, create a new discount
        const newDiscountRef = discountListRef.doc(GenerateCustomID(25));
        await newDiscountRef.set({
          ...discount,
          discountId: newDiscountRef.id, // generate new discountId
          propertyId,
          roomTypeId: roomId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Discount list updated successfully.",
    });
  } catch (error) {
    console.error("Error updating discount list:", error);
    return res.status(500).json({
      status: "failed",
      message: "Error updating discount list.",
      error,
    });
  }
};
