import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import PropertyCard from "@/components/generalComponents/PropertyCard";
import { useSelector } from "react-redux";
import { searchResults } from "@/redux/slices/searchResultSlice";
import { selectSearchCriteria } from "@/redux/slices/searchCriteriaSlice";
import moment from "moment";
import "moment/locale/fr";

const searchResultsPage = () => {
  moment.locale("fr");
  const { loading, error, accommodations } = useSelector(searchResults);
  const searchCriteria = useSelector(selectSearchCriteria);
  const { destination, dates, guests, rooms } = searchCriteria;

  if (loading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView>
        <Text>Error loading accommodations: {error}</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-neutrals-20">
      <ScrollView>
        {/* Header with destination and dates */}
        <View className=" bg-primary p-4">
          <View className="flex flex-row justify-between items-center mb-4">
            <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
              <Image
                source={require("@/assets/icons/arrowWhite.png")}
                className=" w-8 h-8"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View className="flex-1 flex-row ml-4 bg-neutrals-40 p-2 rounded-2xl justify-between items-center">
              <View className="flex flex-col ">
                <Text className="font-lbold text-neutrals-800 text-lg">
                  {destination}
                </Text>
                <View className="flex flex-row justify-between  ">
                  <Text className="font-lbold text-neutrals-800 text-lg">
                    {moment(dates.checkInDate).format("ddd DD MMM")}-{" "}
                    {moment(dates.checkOutDate).format("ddd DD MMM")}
                  </Text>
                  <View className="flex flex-row items-center ml-3">
                    <Image
                      source={require("@/assets/icons/personFiled.png")}
                      className=" w-6 h-6 mr-1"
                      resizeMode="contain"
                    />
                    <Text className="font-lbold text-neutrals-800 text-lg">
                      {guests.adults}
                    </Text>
                  </View>
                  <View className="flex flex-row items-center ml-2">
                    <Image
                      source={require("@/assets/icons/kidFilled.png")}
                      className=" w-6 h-6 mr-1"
                      resizeMode="contain"
                    />
                    <Text className="font-lbold text-neutrals-800 text-lg">
                      {guests.children}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(screens)/accommodationsListing")}
              >
                <Image
                  source={require("@/assets/icons/modifPencil.png")}
                  className="w-8 h-8"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Sort, Filter, Currency Buttons */}
          <View className="flex flex-row justify-between items-center ml-10 mr-4 ">
            <TouchableOpacity className="flex-row items-center space-x-2">
              <Image
                source={require("@/assets/icons/sortWhite.png")}
                className=" w-6 h-6"
                resizeMode="contain"
              />
              <Text className="font-lbold text-neutrals text-xl">Trier</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center space-x-2">
              <Image
                source={require("@/assets/icons/filterfillWhite.png")}
                className=" w-6 h-6"
                resizeMode="contain"
              />
              <Text className="font-lbold text-neutrals text-xl">Filtre</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center space-x-2">
              <Image
                source={require("@/assets/icons/currencyWhite.png")}
                className=" w-6 h-6"
                resizeMode="contain"
              />
              <Text className="font-lbold text-neutrals text-xl">Fcfa</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Accommodation Results */}
        <View className="p-4">
          <Text className="text-neutrals-900 text-2xl font-bold mb-4">
            {`${accommodations?.length || 0} logements trouvés`}
          </Text>
        </View>
        {/* Property Cards */}

        {Array.isArray(accommodations) && accommodations.length > 0 ? (
          accommodations.map((property) => (
            <PropertyCard
              key={property.propertyId}
              property={property}
              containerStyle="flex flex-row "
              imageStyle="w-full h-full"
              presentationStyle="w-2/3 p-2 ml-2"
              imageContainerStyle="w-1/3 h-52"
            />
          ))
        ) : (
          <Text className="text-gray-500 text-center">
            Pas de logement disponible
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default searchResultsPage;
