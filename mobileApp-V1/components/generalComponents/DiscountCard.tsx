import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Property } from "@/typesDeclaration/types";

interface DiscountCardProps {
  discountedProperty: {
    place: string;
    property: Property;
  };
  textColor: string;
}

const DiscountCard: React.FC<DiscountCardProps> = ({
  discountedProperty,
  textColor,
}) => {
  const { place, property } = discountedProperty;
  const discount = ((property.oldPrice - property.newPrice) / property.oldPrice) * 100;

  return (
    <View className="p-4 border border-neutrals-neutrals-n40 rounded-xl">
      <TouchableOpacity className="relative">
        <Image
          source={{ uri: property.propertyImage }}
          className="w-[340px] h-[190px] rounded-xl"
          resizeMode="cover"
        />
        <View className="absolute top-2 left-2 bg-warning m-2 rounded-lg p-2 opacity-90">
          <View className="flex flex-row items-center gap-2">
            <Image source={require("@/assets/icons/discountFilledOnBg.png")} />
            <Text className="font-lbold text-neutrals-neutrals-n700 text-lg">
              Prix membre: {discount.toFixed(0)}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className={`mt-4 ${textColor}`}>
        <Text className="text-lg font-semibold">
          {place}
        </Text>
        <Text className="text-2xl font-bold">
          {property.name}
        </Text>
        <Text className="text-lg">
          {property.distanceToPoint}
        </Text>

        <Text className="mt-2 text-neutrals">
          Deja {property.reviews} Commentaires
        </Text>

        <View className="mt-2">
          <View className="flex flex-row items-center">
            <Text className="font-lbold">Price:</Text>
            <Text className="line-through text-lg text-accents ml-2">
              {property.oldPrice}
            </Text>
            <Text className="font-lbold text-lg ml-2">
              {property.newPrice} Fcfa
            </Text>
          </View>
          <Text className="text-lg">
            pour 2 nuits
          </Text>
          <Text className="text-lg">
            {property.newPrice / 2} Fcfa par nuit
          </Text>
          <Text className="text-lg">
            taxes et frais compris
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DiscountCard;
