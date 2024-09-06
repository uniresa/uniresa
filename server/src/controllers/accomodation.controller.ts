import { Request, Response, NextFunction } from "express";
import { AccommodationProperty } from "../typesDeclaration/types";
import { db } from "../../firebaseConfig";

// Set default values for optional fields in AccommodationProperty
const setDefaultAccommodationValues = (
  accommodation: Partial<AccommodationProperty>
): AccommodationProperty => {
  return {
    propertyId: `${Date.now()}`, // Generate a unique ID based on timestamp
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
    availability: accommodation.availability || [],
    roomTypes: accommodation.roomTypes || [],
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
    const accommodationRef = db
      .collection("accomodations")
      .doc(newAccommodation.propertyId);
    await accommodationRef.set(newAccommodation);
    res.status(201).json({
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
