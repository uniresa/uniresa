import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, StyleSheet, Alert } from "react-native";
import {
  AccommodationProperty,
  Amenities,
  SearchCriteria,
} from "@/typesDeclaration/types";
import PropertyCard from "./PropertyCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { getUpcomingWeekend } from "@/utils/getUpcomingWeekend";

interface Props {
  userId?: string; // Adding userId to identify recent search for each user
}
const { checkInDate, checkOutDate } = getUpcomingWeekend();
const defaultSearchCriteria: SearchCriteria = {
  destination: {
    street: "",
    city: "douala",
    district: "",
    region: "",
    postalCode: "",
    country: "Cameroun",
    latitude: 0,
    longitude: 0,
  },
  dates: { checkInDate, checkOutDate },
  minGuests: 2,
  minRooms: 1,
};
const RecentSearch: React.FC<Props> = ({ userId }) => {
  const backendApi = process.env.EXPO_PUBLIC_BASE_URL;
  const [filteredHotels, setFilteredHotels] = useState<AccommodationProperty[]>(
    []
  );

  const recentSearch =
    useSelector((state: RootState) =>
      userId ? state.userSearchHistory[userId]?.recentSearch : null
    ) || defaultSearchCriteria;

  useEffect(() => {
    const fetchRecentSearch = async () => {
      if (!userId) {
        setFilteredHotels([]);
        return;
      }
      if (!backendApi) {
        throw new Error("URL missing");
      }
      try {
        //fetch data based on user search history
        const response = await axios.post(
          `${backendApi}/api/accommodation/getSearchedAccomodations`,
          recentSearch,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        const results = await response.data?.data;
        if (!results || results.length === 0) {
          console.log("No results based on recent search");
        }
        setFilteredHotels(results);
      } catch (error) {
        console.error("Error fetching recent search:", error);
        Alert.alert("Une erreur lors de la recharge des donnees");
      }
    };
    fetchRecentSearch();
  }, [recentSearch, userId]);

  return (
    <View>
      {filteredHotels.length > 0 ? (
        <FlatList
          data={filteredHotels}
          keyExtractor={(item) => item.propertyId}
          renderItem={({ item }) => (
            <PropertyCard property={item} textColor="text-" />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text className="text-center text-neutrals-800 mt-4 font-lbold">
          No results found.
        </Text>
      )}
    </View>
  );
};

export default RecentSearch;
