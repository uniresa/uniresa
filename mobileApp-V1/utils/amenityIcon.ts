export const getAmenityIcon = (amenityName: string) => {
  switch (amenityName.toLowerCase()) {
    case "freeWiFi":
      return require("@/assets/icons/amenities/wifi.png");
    case "parking":
      return require("@/assets/icons/amenities/parking.png");
    case "swimmingPool":
      return require("@/assets/icons/amenities/swimmingPool.png");
    case "airConditioning":
      return require("@/assets/icons/amenities/airConditioning.png");
    case "gym":
      return require("@/assets/icons/amenities/gym.png");
    case "breakfast":
      return require("@/assets/icons/amenities/breakfast.png");
    case "laundryService":
      return require("@/assets/icons/amenities/laundry.png");
    case "privateBathroom":
      return require("@/assets/icons/amenities/bath.png");
    case "cleaningService":
      return require("@/assets/icons/amenities/cleaningService.png");
    case "restaurant":
      return require("@/assets/icons/amenities/restaurant.png");
    case "bar":
      return require("@/assets/icons/amenities/bar.png");
    case "ventilateur":
      return require("@/assets/icons/amenities/ventilateur.png");
    case "pets":
      return require("@/assets/icons/amenities/pets.png");
    default:
      return require("@/assets/icons/amenities/yesTick.png"); // Return yes tick if no icon is found
  }
};
