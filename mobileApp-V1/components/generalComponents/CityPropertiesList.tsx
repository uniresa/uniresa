import { View, Text, FlatList, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { Property } from "@/typesDeclaration/types";
import { data } from "@/data/tempData";

const CityPropertiesList = () => {
  const [hotelsPerCity, setHotelsPerCity] = useState<Property[]>([]);
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.place}
      renderItem={({ item }) => (
        <Pressable className="flex flex-col mx-2 items-start border border-neutrals-100 rounded-2xl overflow-hidden">
          <Image
            source={{ uri: item.placeImage }}
            className="w-[335px] h-[150px]"
            resizeMode="cover"
          />
          <View className="p-4">
            <Text className="font-bold text-lg font-rbold text-neutrals-900 ">
              {item.place}
            </Text>
            <Text className=" text-base font-lregular text-neutrals-900 ">
              {item.department}, {item.region}, {item.country}
            </Text>
          </View>
        </Pressable>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 6 }}
    />
  );
};

export default CityPropertiesList;
