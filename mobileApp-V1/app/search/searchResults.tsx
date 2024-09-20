import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import PropertyCard from "@/components/generalComponents/PropertyCard";
import { useSelector } from "react-redux";
import { searchResults } from "@/redux/slices/searchResultSlice";

const searchResultsPage = () => {
  const [loading, error, accommodations] = useSelector(searchResults);
  return (
    <SafeAreaView className="flex-1 bg-neutrals-20">
      <ScrollView>
        <View className="flex justify-between items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="mx-4 my-2"
          >
            <Image
              source={require("@/assets/icons/backArrowActive.png")}
              className=" w-8 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View className="flex justify-between items-center p-4">
            <View className="flex justify-between items-center p-4">
              <Text>{"destination"}</Text>
              <View className="flex justify-between items-center p-4">
                <Text>{"dates"}</Text>
                <View className="flex justify-between items-center p-4">
                  <Image />
                  <Text>{"adults"}</Text>
                </View>
                <View className="flex justify-between items-center p-4">
                  <Image />
                  <Text>{"children"}</Text>
                </View>
              </View>
            </View>
            <View className="flex justify-between items-center p-4">
              <Image />
            </View>
          </View>
        </View>
        <View className="flex justify-between items-center p-4">
          <TouchableOpacity className="flex justify-between items-center p-4">
            <Image />
            <Text>Trier</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex justify-between items-center p-4">
            <Image />
            <Text>Filtre</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex justify-between items-center p-4">
            <Image />
            <Text>Fcfa</Text>
          </TouchableOpacity>
        </View>
        <View className="flex justify-between items-center p-4">
          <Text className="text-neutrals text-xl font-bold">
            {"12 logements trouvés"}
          </Text>
        </View>
        {/* Property Cards */}
        <PropertyCard property={accommodations} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default searchResultsPage;
