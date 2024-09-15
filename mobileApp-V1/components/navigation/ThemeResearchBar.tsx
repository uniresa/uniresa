import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import bedColored from "@/assets/icons/bedColored.png";
import automobile from "@/assets/icons/automobile.png";
import airplane from "@/assets/icons/airplane.png";
import taxiIcon from "@/assets/icons/taxiIcon.png";
import { Href, router } from "expo-router";

const ThemeResearchBar = () => {
  return (
    <View className="bg-primary w-full  pl-4  justify-center py-1">
      <View className="bg-secondary-50 mx-4 rounded-2xl p-4 flex flex-row justify-between items-center shadow-md">
        <Pressable
          className="flex flex-col items-center justify-center"
          onPress={() =>
            router.push(
              "/accommodationsListing" as Href<"/accommodationsListing">
            )
          }
        >
          <Image source={bedColored} style={{ width: 40, height: 40 }} />
          <Text className="font-lbold text-lg text-neutrals-neutrals-n900 mt-2">
            Séjours
          </Text>
        </Pressable>
        <Pressable className="flex flex-col items-center justify-center">
          <Image source={airplane} style={{ width: 40, height: 40 }} />
          <Text className="font-lbold text-lg text-neutrals-neutrals-n900 mt-2">
            Vols
          </Text>
        </Pressable>
        <Pressable className="flex flex-col items-center justify-center">
          <Image source={automobile} style={{ width: 40, height: 40 }} />
          <Text className="font-lbold text-lg text-neutrals-neutrals-n900 mt-2">
            Voitures
          </Text>
        </Pressable>
        <Pressable className="flex flex-col items-center justify-center mt-2">
          <Image source={taxiIcon} style={{ width: 40, height: 40 }} />
          <Text className="font-lbold text-lg text-neutrals-neutrals-n900">
            Taxi
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ThemeResearchBar;
