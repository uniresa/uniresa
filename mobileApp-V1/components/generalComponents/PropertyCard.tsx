import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import React, { PropsWithChildren } from "react";
import { Property } from "@/typesDeclaration/types";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

interface PropertyCardProps {
  property: Property;
  textColor: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, textColor }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= property.rating ? "star" : "star-o"}
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
    <Pressable className="flex flex-col mx-2 p-4 items-start border  border-neutrals-20 gap-2 rounded-lg">
      <Image
        source={{ uri: property.propertyImage }}
        style={{ width: 290, height: 150, borderRadius: 12 }}
        resizeMode="cover"
      />
      <View className="mt-4 w-full">
        <View className="flex flex-row items-center justify-between">
          <Text className={`text-lg font-semibold ${textColor}`}>
            {property.name}
          </Text>
          <View className="flex flex-row items-center">{renderStars()}</View>
        </View>
        <View className="flex flex-row items-center mt-2">
          <Image
            source={require("@/assets/icons/tripAdvisor.png")}
            style={{ width: 36, height: 20 }}
            resizeMode="contain"
          />
          <View className="flex flex-row ml-2">{renderReviewRating()}</View>
          <Text className="ml-2 text-sm text-neutrals-500">
            {property.reviews} Commentaires
          </Text>
        </View>
        <Text className="text-sm text-neutrals-500 mt-2">
          {property.distanceToPoint}
        </Text>
        <View className="flex flex-row gap-2 items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <Text className="font-lbold text-lg text-neutrals-900">Price:</Text>
            <Text className="line-through text-lg text-accents">
              {property.oldPrice}
            </Text>
            <Text className="font-lbold text-lg text-secondary-600">
              {property.newPrice} Fcfa
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
    // </View>
  );
};

export default PropertyCard;
