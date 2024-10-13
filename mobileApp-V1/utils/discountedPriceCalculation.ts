import {
  AccommodationProperty,
  PriceDetails,
  RoomType,
} from "@/typesDeclaration/types";

export const calculateDiscountedPrice = (
  priceDetails: PriceDetails
): number => {
  const { pricePerNight, discount } = priceDetails;

  // If there is no discount, return the original price
  if (!discount || !discount.isActive) {
    return pricePerNight;
  }

  const { discountType, discountAmount, discountPercentage } = discount;

  // Calculate the discounted price based on the discount type
  if (discountType === "percentage" && discountPercentage) {
    return pricePerNight - (pricePerNight * discountPercentage) / 100;
  } else if (discountType === "fixed" && discountAmount) {
    return pricePerNight - discountAmount;
  }

  // If none of the conditions match, return the original price
  return pricePerNight;
};

export const getRenderedPrice = (
  roomTypes: RoomType[]
): {
  propertyRenderedPrice: number;
  propertyDiscountedPrice: number;
  roomId: string; // Return the roomId of the room with the lowest price
} => {
  let propertyRenderedPrice: number = Infinity;
  let propertyDiscountedPrice: number = Infinity;
  let cheapestRoomId: string = "";

  roomTypes.forEach((roomType) => {
    const { priceDetails, roomId } = roomType;

    // Get the discounted price

    // Check if the current room is cheaper than the previously found cheapest room
    if (priceDetails.pricePerNight < propertyRenderedPrice) {
      propertyRenderedPrice = priceDetails.pricePerNight;
      propertyDiscountedPrice = calculateDiscountedPrice(priceDetails);
      cheapestRoomId = roomId;
      console.log(
        `property: ${propertyRenderedPrice}, discount: ${propertyDiscountedPrice}, roomID:${roomId}`
      );
    }
  });

  return {
    propertyRenderedPrice:
      propertyRenderedPrice === Infinity ? 0 : propertyRenderedPrice,
    propertyDiscountedPrice:
      propertyDiscountedPrice === Infinity ? 0 : propertyDiscountedPrice,
    roomId: cheapestRoomId,
  };
};
