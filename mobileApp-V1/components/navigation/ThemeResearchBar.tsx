import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import bedColored from "@/assets/icons/bedColored.png";
import automobile from "@/assets/icons/automobile.png";
import airplane from "@/assets/icons/airplane.png";
import taxiIcon from "@/assets/icons/taxiIcon.png";

const ThemeResearchBar = () => {
  return (
    <View className="bg-primary w-full  pl-4  justify-center">
      <View className="bg-secondary-50 mx-2 rounded-2xl p-2 flex flex-row items-center">
        <Pressable className="flex flex-col gap-4 mx-4 items-center justify-center">
          <Image source={bedColored} style={{ width: 40, height: 40 }} />
          <Text className="font-lbold text-lg text-neutrals-neutrals-n900">
            Séjours
          </Text>
        </Pressable>
        <Pressable className="flex flex-col gap-4 mx-4 items-center justify-center">
          <Image source={airplane} style={{ width: 40, height: 40 }} />
          <Text className="font-lbold text-lg text-neutrals-neutrals-n900">
            Vols
          </Text>
        </Pressable>
        <Pressable className="flex flex-col gap-4 mx-4 items-center justify-center">
          <Image source={automobile} style={{ width: 40, height: 40 }} />
          <Text className="font-lbold text-lg text-neutrals-neutrals-n900">
            Voitures
          </Text>
        </Pressable>
        <Pressable className="flex flex-col gap-4 mx-4 items-center justify-center">
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
