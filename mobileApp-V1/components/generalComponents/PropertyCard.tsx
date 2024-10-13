import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import React, { PropsWithChildren } from "react";
import { AccommodationProperty } from "@/typesDeclaration/types";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { getRenderedPrice } from "@/utils/discountedPriceCalculation";

interface PropertyCardProps {
  property: AccommodationProperty;
  textColor?: string;
  containerStyle?: string;
  imageStyle?: string;
  presentationStyle?: string;
  imageContainerStyle?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  textColor,
  containerStyle,
  imageStyle,
  presentationStyle,
  imageContainerStyle,
}) => {
  const { propertyRenderedPrice, propertyDiscountedPrice, roomId } =
    getRenderedPrice(property.roomTypes);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= property.numberOfStars ? "star" : "star-o"}
          size={16}
          color="#E89600"
        />
      );
    }
    return stars;
  };

  const renderReviewRating = () => {
    const circles = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= property.reviewsRating) {
        circles.push(
          <MaterialCommunityIcons
            key={i}
            name="circle"
            size={16}
            color="#07A872"
          />
        );
      } else if (i - property.reviewsRating < 1) {
        circles.push(
          <MaterialCommunityIcons
            key={i}
            name="circle-half-full"
            size={16}
            color="#07A872"
          />
        );
      } else {
        circles.push(
          <MaterialCommunityIcons
            key={i}
            name="circle-outline"
            size={16}
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
      <View className={`rounded-xl overflow-hidden ${imageContainerStyle}`}>
        <Image
          source={{ uri: property.images[0] }}
          className={`w-72 rounded-xl ${imageStyle}`}
          resizeMode="cover"
        />
      </View>
      <View className={` w-full ${presentationStyle}`}>
        <View className="flex mb-1 items-start justify-between gap-1">
          <Text className={`text-lg font-semibold ${textColor}`}>
            {property.propertyName}
          </Text>
          <View className="flex flex-row items-center">{renderStars()}</View>
        </View>
        <View className="flex flex-row items-center mt-2">
          <Image
            source={require("@/assets/icons/tripAdvisor.png")}
            style={{ width: 30, height: 16 }}
            resizeMode="cover"
          />
          <View className="flex flex-row ml-2">{renderReviewRating()}</View>
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
        <View className="flex flex-row mt-2 items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <Text className="font-lbold text-lg text-neutrals-900">Price:</Text>
            {propertyRenderedPrice &&
            propertyRenderedPrice > propertyDiscountedPrice ? (
              <Text>
                <Text className="line-through text-lg text-accents">
                  {propertyRenderedPrice.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "XAF",
                  })}
                </Text>
                <Text className="font-lbold text-lg text-secondary-600">
                  {propertyDiscountedPrice.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "XAF",
                  })}
                </Text>
              </Text>
            ) : (
              <Text className="font-lbold text-lg text-secondary-600">
                {propertyRenderedPrice.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "XAF",
                })}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;
