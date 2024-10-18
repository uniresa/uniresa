import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import React, { PropsWithChildren } from "react";
import { AccommodationProperty } from "@/typesDeclaration/types";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { getRenderedPrice } from "@/utils/discountedPriceCalculation";
import { useSelector } from "react-redux";
import { selectSearchCriteria } from "@/redux/slices/searchCriteriaSlice";
import { getAmenityIcon } from "@/utils/amenityIcon";

interface PropertyCardProps {
  property: AccommodationProperty;
  textColor?: string;
  containerStyle?: string;
  imageStyle?: string;
  presentationStyle?: string;
  imageContainerStyle?: string;
  reviewSize?: number;
  starSize?: number;
  amenityIconStyle?: string;
  tripIconStyle?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  textColor,
  containerStyle,
  imageStyle,
  presentationStyle,
  imageContainerStyle,
  reviewSize,
  starSize,
  amenityIconStyle,
  tripIconStyle,
}) => {
  const { dates } = useSelector(selectSearchCriteria);
  const { propertyInitialPrice, propertyDiscountedPrice, roomId } =
    getRenderedPrice(property.roomTypes);
  // Convert check-in and check-out strings to Date objects
  const checkInDate = new Date(dates.checkInDate);
  const checkOutDate = new Date(dates.checkOutDate);
  // Calculate the number of nights
  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  const nights = Math.round(
    Math.abs((checkOutDate.getTime() - checkInDate.getTime()) / oneDay)
  );
  const totalDiscountedPrice = propertyDiscountedPrice * nights;
  const totalInitialPrice = propertyInitialPrice * nights;

  const roomTotalPrice =
    totalDiscountedPrice && totalDiscountedPrice != 0
      ? totalDiscountedPrice
      : totalInitialPrice;
  const totalDiscount = totalInitialPrice - totalDiscountedPrice;
  const renderStars = (starSize = 16) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= property.numberOfStars ? "star" : "star-o"}
          size={starSize}
          color="#E89600"
        />
      );
    }
    return stars;
  };
  console.log(property.propertyId);

  const renderReviewRating = (size = 16) => {
    const circles = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= property.reviewsRating) {
        circles.push(
          <MaterialCommunityIcons
            key={i}
            name="circle"
            size={size}
            color="#07A872"
          />
        );
      } else if (i - property.reviewsRating < 1) {
        circles.push(
          <MaterialCommunityIcons
            key={i}
            name="circle-half-full"
            size={size}
            color="#07A872"
          />
        );
      } else {
        circles.push(
          <MaterialCommunityIcons
            key={i}
            name="circle-outline"
            size={size}
            color="#07A872"
          />
        );
      }
    }
    return circles;
  };

  return (
    <TouchableOpacity
      className={`flex flex-col m-2 border  border-neutrals-60 rounded-xl ${containerStyle}`}
      key={property.propertyId}
      onPress={() =>
        router.push({
          pathname: "/(search)/[propertyId]",
          params: {
            propertyId: property.propertyId,
            property: JSON.stringify(property),
          },
        })
      }
    >
      <View
        className={`rounded-l-xl ${imageContainerStyle} flex justify-center`}
      >
        <Image
          source={{ uri: property.images[0] }}
          className={`w-full h-full rounded-l-xl ${imageStyle}`}
          resizeMode="cover"
        />
      </View>
      <View className={` w-full ${presentationStyle} justify-between`}>
        <View className="flex mb-1 items-start justify-between gap-1">
          <Text className={`text-lg font-semibold ${textColor}`}>
            {property.propertyName}
          </Text>
          <View className="flex flex-row items-center">
            {renderStars(starSize)}
          </View>
        </View>
        <View className="flex flex-row items-center mt-2">
          <Image
            source={require("@/assets/icons/tripAdvisor.png")}
            className={`w-6 h-6 ${tripIconStyle}`}
            style={{ width: 24, height: 15 }}
            resizeMode="cover"
          />
          <View className="flex flex-row ml-2">
            {renderReviewRating(reviewSize)}
          </View>
          <Text className="ml-2 text-sm text-neutrals-500">
            {property.numberOfReviews} Commentaires
          </Text>
        </View>
        {property.distanceFromCityCenter && (
          <Text className="text-sm text-neutrals-700 mt-2">
            {`${property.distanceFromCityCenter} km du centre ville`}
          </Text>
        )}
        {property.distanceFromSea != null && property.distanceFromSea != 0 && (
          <Text className="text-sm text-neutrals-500 mt-2">
            {`${property.distanceFromSea} km de la mer`}
          </Text>
        )}
        <View className="flex flex-row flex-wrap items-center mt-2 pr-2">
          {Array.isArray(property.amenities) &&
            property.amenities
              .filter((amenity) => amenity.isAvailable && amenity.isPopular)
              .slice(0, 4)
              .map((amenity, index) => {
                const icon = getAmenityIcon(amenity.amenityId);
                return (
                  <View
                    key={index}
                    className="w-[48%] mb-1 flex flex-row items-center"
                  >
                    {icon && (
                      <Image
                        source={icon}
                        className={`w-4 h-4 mr-1 ${amenityIconStyle}`}
                        resizeMode="contain"
                      />
                    )}
                    <Text className="text-neutrals-800 text-sm">
                      {amenity.amenityName}
                    </Text>
                  </View>
                );
              })}
        </View>
        <View className="mt-2 p-2">
          {propertyDiscountedPrice &&
          propertyDiscountedPrice < propertyInitialPrice ? (
            <View className="flex items-end">
              <View className="rounded-md items-center p-1 bg-secondary-600 mb-3">
                <Text className="text-neutrals text-sm font-semibold">
                  - {totalDiscount.toLocaleString("fr-FR")}
                </Text>
              </View>
              <Text className="font-lbold text-lg text-neutrals-900">
                <Text className="line-through text-sm text-accents">
                  {totalInitialPrice.toLocaleString("fr-FR")}
                </Text>
                {"  "}
                <Text className="font-bold text-lg ">
                  {totalDiscountedPrice.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "XAF",
                  })}
                </Text>
              </Text>
              <Text className="flex flex-row text-sm text-neutrals-800">
                {property.propertyType === "Hotel" ? (
                  <Text>1 chambre,</Text>
                ) : property.propertyType === "Furnished Apartment" ? (
                  <Text>1 appartement,</Text>
                ) : (
                  <Text>1 maison,</Text>
                )}
                {"  "}
                {nights > 1 ? (
                  <Text className="text-sm text-neutrals-800">
                    {nights} nuits
                  </Text>
                ) : (
                  <Text className="text-sm text-neutrals-800">
                    {nights} nuit
                  </Text>
                )}
              </Text>
              {nights > 1 ? (
                <Text>
                  <Text className="font-semibold">
                    {propertyDiscountedPrice.toLocaleString("fr-FR")}{" "}
                  </Text>
                  par nuit
                </Text>
              ) : (
                ""
              )}
            </View>
          ) : (
            <Text className="font-lbold text-lg text-secondary-600">
              {totalInitialPrice.toLocaleString("fr-FR", {
                style: "currency",
                currency: "XAF",
              })}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;
