import { View, Text, Image, ImageBackground, Pressable } from "react-native";
import React from "react";
import { AccommodationProperty } from "@/typesDeclaration/types";
import DiscountButton from "./DiscountButton";

interface DiscountCardProps {
  discountedProperty: {
    city: string;
    cheapestProperty: AccommodationProperty;
    cheapestRoomPrice: number;
    initialRoomPrice: number;
    discountPercentage: number;
  };

  textColor: string;
}

const DiscountCard: React.FC<DiscountCardProps> = ({
  discountedProperty,
  textColor,
}) => {
  return (
    <View className="mr-4 rounded-xl shadow-md">
      <Pressable className="relative">
        <ImageBackground
          source={{ uri: discountedProperty.cheapestProperty.images[0] }}
          className="w-[320px] h-[190px] rounded-xl"
          imageStyle={{ borderRadius: 15 }}
          resizeMode="cover"
        >
          <View className="absolute top-2 left-2 m-2 rounded-lg">
            <DiscountButton
              buttonText="Prix membre"
              discountButtonBgColor="bg-warning"
              buttonTextColor="text-neutrals-900"
              discuntIcon={
                <Image
                  source={require("@/assets/icons/discountOutline.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              }
            />
          </View>
        </ImageBackground>
        <View className="p-4">
          <Text className={`text-base ${textColor} font-semibold`}>
            {discountedProperty.city}
          </Text>
          <Text className={`text-xl ${textColor} font-bold`}>
            {discountedProperty.cheapestProperty.propertyName}
          </Text>
          <View className="mt-2">
            <View className="flex flex-row items-center gap-4">
              <Text className={`font-lbold text-lg ${textColor}`}>
                {discountedProperty.cheapestRoomPrice.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "XAF",
                })}
              </Text>
              <Text
                className={`line-through font-lregular text-base ${textColor}`}
              >
                {discountedProperty.initialRoomPrice.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "XAF",
                })}
              </Text>
            </View>
            <Text className={`text-base ${textColor} mt-1`}>pour 2 nuits</Text>
            <Text className={`text-base ${textColor} mt-1`}>
              {(discountedProperty.cheapestRoomPrice / 2).toLocaleString(
                "fr-FR",
                {
                  style: "currency",
                  currency: "XAF",
                }
              )}{" "}
              par nuit
            </Text>
            <Text className={`text-sm ${textColor} mt-1`}>
              taxes et frais compris
            </Text>
          </View>
          <View className="mt-4">
            <DiscountButton
              discount={discountedProperty.discountPercentage.toFixed(0)}
              discountButtonBgColor="bg-accents"
              buttonTextColor="text-neutrals"
              discuntIcon={
                <Image
                  source={require("@/assets/icons/discountOutlineOnBg.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              }
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default DiscountCard;
