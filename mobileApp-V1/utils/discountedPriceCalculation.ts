import { PriceDetails } from "@/typesDeclaration/types";

export const calculateDiscountedPrice = (priceDetails: PriceDetails): number => {
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