import { Request, Response } from "express";
import { AvailabilityDetails } from "../typesDeclaration/types";
import { db } from "../../firebaseConfig";

const checkDatesOverlap = (
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean => {
  return start1 <= end2 && start2 <= end1;
};
export const checkPropertyAvailability = async (
  propertyId: string,
  checkInDate: Date,
  checkOutDate: Date,
  specificRoomTypeIds: string[]
): Promise<boolean> => {
  try {
    const roomTypesSnapshot = await db
      .collection("accommodations")
      .doc(propertyId)
      .collection("roomTypes")
      .get();
    if (roomTypesSnapshot.empty) {
      console.error(`No room types found for propertyId: ${propertyId}`);
      throw new Error("No room types found for this property.");
    }

    if (specificRoomTypeIds && specificRoomTypeIds.length > 0) {
      // Check availability for a specific room type
      for (const specificRoomTypeId of specificRoomTypeIds) {
        const specificRoomTypeRef = roomTypesSnapshot.docs.find(
          (doc) => doc.id === specificRoomTypeId
        );

        if (!specificRoomTypeRef) {
          throw new Error("Room type not found");
        }

        const roomAvailabilitiesRef =
          specificRoomTypeRef.ref.collection("roomAvailabilities");
        const roomAvailabilitiesSnapshot = await roomAvailabilitiesRef.get();

        for (const doc of roomAvailabilitiesSnapshot.docs) {
          const availability = doc.data() as AvailabilityDetails;
          if (
            checkDatesOverlap(
              new Date(availability.startDate),
              new Date(availability.endDate),
              checkInDate,
              checkOutDate
            )
          ) {
            return false; // Specific room type is not available for the requested dates.
          }
        }
      }
    } else {
      // Check availability for the entire property based on all room types
      for (const roomTypeDoc of roomTypesSnapshot.docs) {
        const roomAvailabilitiesRef =
          roomTypeDoc.ref.collection("roomAvailabilities");
        const roomAvailabilitiesSnapshot = await roomAvailabilitiesRef.get();

        let isRoomTypeAvailable = false; // Track if any availability is found for the room type
        for (const doc of roomAvailabilitiesSnapshot.docs) {
          const availability = doc.data() as AvailabilityDetails;
          if (
            checkDatesOverlap(
              new Date(availability.startDate),
              new Date(availability.endDate),
              checkInDate,
              checkOutDate
            )
          ) {
            isRoomTypeAvailable = true;
            break; // No need to check further for this room type
          }
        }

        if (!isRoomTypeAvailable) {
          return false; // If any room type is not available, return false
        }
      }
    }

    return true; // All room types are available for the requested dates.
  } catch (error) {
    console.error("Error checking availability:", error);
    throw new Error("Failed to check availability");
  }
};
