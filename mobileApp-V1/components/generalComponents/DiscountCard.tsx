import { View, Text, Image, ImageBackground, Pressable } from "react-native";
import React from "react";
import { Property } from "@/typesDeclaration/types";
import DiscountButton from "./DiscountButton";

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
  const discount =
    ((property.oldPrice - property.newPrice) / property.oldPrice) * 100;

  return (
    <View className="mr-4 rounded-xl ">
      <Pressable className="relative gap-2">
        <ImageBackground
          source={{ uri: property.propertyImage }}
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
        <Text className="text-lg text-neutrals font-semibold">{place}</Text>
        <Text className="text-2xl text-neutrals font-bold">
          {property.name}
        </Text>
        <View className="mt-2">
          <View className="flex flex-row items-center justify-start gap-6">
            <Text className="font-lbold text-neutrals text-lg">
              {property.newPrice} Fcfa
            </Text>
            <Text className="line-through text-lg text-neutrals">
              {property.oldPrice}
            </Text>
          </View>
          <Text className="text-lg text-neutrals">pour 2 nuits</Text>
          <Text className="text-lg text-neutrals">
            {property.newPrice / 2} Fcfa par nuit
          </Text>
          <Text className="text-lg text-neutrals">taxes et frais compris</Text>
        </View>
        <View className="mt-2">
          <DiscountButton
            discount={discount.toFixed(0)}
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
      </Pressable>
    </View>
  );
};

export default DiscountCard;
