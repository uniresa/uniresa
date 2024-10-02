export const getAmenityIcon = (amenityId: string) => {
  switch (amenityId) {
    case "100000":
      return require("@/assets/icons/amenities/wifi.png");
    case "100001":
      return require("@/assets/icons/amenities/parking.png");
    case "100003":
      return require("@/assets/icons/amenities/swimmingPool.png");
    case "100004":
      return require("@/assets/icons/amenities/airConditioning.png");
    case "100002":
      return require("@/assets/icons/amenities/gym.png");
    case "100011":
      return require("@/assets/icons/amenities/breakfast.png");
    case "100008":
      return require("@/assets/icons/amenities/laundry.png");
    case "privateBathroom":
      return require("@/assets/icons/amenities/bath.png");
    case "cleaningService":
      return require("@/assets/icons/amenities/cleaningService.png");
    case "100009":
      return require("@/assets/icons/amenities/restaurant.png");
    case "100005":
      return require("@/assets/icons/amenities/bar.png");
    case "100010":
      return require("@/assets/icons/amenities/pets.png");
    case "100013":
      return require("@/assets/icons/amenities/ventilateur.png");
    default:
      return require("@/assets/icons/amenities/yesTick.png"); // Return yes tick if no icon is found
  }
};
