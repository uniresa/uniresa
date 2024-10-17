import { DiscountDetails, RoomType } from "@/typesDeclaration/types";
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
  roomId: string;
} => {
  let propertyInitialPrice: number = Infinity;
  let propertyDiscountedPrice: number = Infinity;
  let cheapestRoomId: string = "";

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
    }

    console.log(
      `property: ${propertyInitialPrice}, discount: ${propertyDiscountedPrice}, roomID:${roomId}`
    );
  });

  return {
    propertyInitialPrice:
      propertyInitialPrice === Infinity ? 0 : propertyInitialPrice,
    propertyDiscountedPrice:
      propertyDiscountedPrice === Infinity ? 0 : propertyDiscountedPrice,
    roomId: cheapestRoomId,
  };
};
