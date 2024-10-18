import {
  AccommodationProperty,
  DiscountDetails,
  RoomType,
} from "@/typesDeclaration/types";
import moment from "moment";
import "moment/locale/fr";

export const calculateDiscountedPrice = (
  pricePerNight: number,
  discountList: DiscountDetails[]
): number => {
  const activeDiscounts = discountList.filter((discount) => {
    return discount.isActive;
  });

  if (activeDiscounts.length === 0) {
    return 0;
  }

  // Apply the best discount (highest value)
  const bestDiscount = activeDiscounts.reduce((prev, curr) => {
    const prevDiscountValue =
      prev.discountType === "Percentage"
        ? (pricePerNight * prev.discountValue) / 100
        : prev.discountValue;
    const currDiscountValue =
      curr.discountType === "Percentage"
        ? (pricePerNight * curr.discountValue) / 100
        : curr.discountValue;

    return currDiscountValue > prevDiscountValue ? curr : prev;
  });

  if (bestDiscount.discountType === "Percentage") {
    return pricePerNight - (pricePerNight * bestDiscount.discountValue) / 100;
  } else if (bestDiscount.discountType === "Flat Fee") {
    return pricePerNight - bestDiscount.discountValue;
  }

  return pricePerNight; // Return original price if no valid discount is found
};

export const getRenderedPrice = (
  roomTypes: RoomType[]
): {
  propertyInitialPrice: number;
  propertyDiscountedPrice: number;
  discountPercentage: number;
  roomId: string;
} => {
  let propertyInitialPrice: number = Infinity;
  let propertyDiscountedPrice: number = Infinity;
  let cheapestRoomId: string = "";
  let discountPercentage: number = 0;

  roomTypes.forEach((roomType) => {
    const { priceDetails, roomId, discountList } = roomType;

    const roomDiscountedPrice = calculateDiscountedPrice(
      priceDetails.pricePerNight,
      discountList
    );

    if (roomDiscountedPrice < propertyDiscountedPrice) {
      propertyDiscountedPrice = roomDiscountedPrice;
      cheapestRoomId = roomId;
      propertyInitialPrice = priceDetails.pricePerNight;

      // Calculate discount percentage
      discountPercentage =
        propertyInitialPrice > 0
          ? ((propertyInitialPrice - roomDiscountedPrice) /
              propertyInitialPrice) *
            100
          : 0;
    }
  });

  return {
    propertyInitialPrice:
      propertyInitialPrice === Infinity ? 0 : propertyInitialPrice,
    propertyDiscountedPrice:
      propertyDiscountedPrice === Infinity ? 0 : propertyDiscountedPrice,
    discountPercentage,
    roomId: cheapestRoomId,
  };
};

export const getCheapestAccommodationPerCity = (
  properties: AccommodationProperty[]
): {
  city: string;
  cheapestProperty: AccommodationProperty;
  cheapestRoomPrice: number;
  initialRoomPrice: number;
  discountPercentage: number;
}[] => {
  const cityMap = new Map<
    string,
    {
      property: AccommodationProperty;
      discountedPrice: number;
      initialPrice: number;
      discountPercentage: number;
    }
  >();

  properties.forEach((property) => {
    const {
      propertyDiscountedPrice,
      propertyInitialPrice,
      discountPercentage,
    } = getRenderedPrice(property.roomTypes);

    if (propertyDiscountedPrice > 0) {
      const city = property.location.city;

      if (
        !cityMap.has(city) ||
        cityMap.get(city)!.discountedPrice > propertyDiscountedPrice
      ) {
        cityMap.set(city, {
          property,
          discountedPrice: propertyDiscountedPrice,
          initialPrice: propertyInitialPrice,
          discountPercentage,
        });
      }
    }
  });

  // Convert the cityMap to an array for returning
  return Array.from(cityMap.entries()).map(
    ([
      city,
      { property, discountedPrice, initialPrice, discountPercentage },
    ]) => ({
      city,
      cheapestProperty: property,
      cheapestRoomPrice: discountedPrice,
      initialRoomPrice: initialPrice,
      discountPercentage,
    })
  );
};
