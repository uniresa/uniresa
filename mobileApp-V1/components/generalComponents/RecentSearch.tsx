import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { data } from "@/data/tempData";
import {
  Place,
  AccommodationProperty,
  Amenities,
} from "@/typesDeclaration/types";
import PropertyCard from "./PropertyCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Props {
  userId: string; // Adding userId to identify recent search for each user
}
const defaultSearchCriteria: {
  place: string;
  minRating: number;
  maxPrice: number;
  minStars: number;
  minGuests: number;
  minRooms: number;
  amenities: Amenities;
} = {
  place: "Yaounde",
  minRating: 2,
  maxPrice: 10000,
  minStars: 3,
  minGuests: 2,
  minRooms: 2,
  amenities: {
    freeWiFi: true,
    parking: true,
    swimmingPool: true,
    airConditioning: true,
    kitchen: true,
  },
};
const RecentSearch: React.FC<Props> = ({ userId }) => {
  const [filteredHotels, setFilteredHotels] = useState<AccommodationProperty[]>(
    []
  );
  const { accommodations } = useSelector(
    (state: RootState) => state.accommodationsList
  );
  // Use recent search if available, otherwise use default criteria
  const recentSearch =
    useSelector((state: RootState) =>
      userId ? state.userSearchHistory[userId]?.recentSearch : null
    ) || defaultSearchCriteria;

  useEffect(() => {
    if (recentSearch) {
      const results = accommodations
        .filter((accomodation) =>
          accomodation.location.city
            .toLowerCase()
            .includes(recentSearch.place.toLowerCase())
        )
        .flatMap((accommodation) => accommodation)
        .filter(
          (property) =>
            property.numberOfStars >= recentSearch.minRating &&
            Object.values(property.roomTypes).some(
              (roomType) =>
                roomType.priceDetails.pricePerNight <= recentSearch.maxPrice
            )
        )
        .map((property) => ({
          propertyId: property.propertyId,
          propertyName: property.propertyName,
          propertyType: property.propertyType,
          description: property.description,
          location: property.location,
          images: property.images,
          amenities: property.amenities,
          policies: property.policies,
          checkInDetails: property.checkInDetails,
          priceDetails: property.priceDetails,
          finalCleaning: property.finalCleaning,
          numberOfStars: property.numberOfStars,
          reviews: property.reviews,
          numberOfReviews: property.numberOfReviews,
          reviewsRating: property.reviewsRating,
          propertyAvailabilities: property.propertyAvailabilities,
          roomTypes: property.roomTypes,
          distanceFromCityCenter: property.distanceFromCityCenter,
          distanceFromSea: property.distanceFromSea,
          popularFacilities: property.popularFacilities,
          hostDetails: property.hostDetails,
          nearbyAttractions: property.nearbyAttractions,
          healthAndSafetyMeasures: property.healthAndSafetyMeasures,
          cancellationPolicy: property.cancellationPolicy,
          keyCollection: property.keyCollection,
          propertyBookings: property.propertyBookings,
          createdAt: property.createdAt,
          updatedAt: property.updatedAt,
        }));
      setFilteredHotels(results);
    } else {
      setFilteredHotels([]); // Reset if no recent search is available
    }
  }, [recentSearch, accommodations]);

  return (
    <FlatList
      data={filteredHotels}
      keyExtractor={(item) => item.propertyId}
      renderItem={({ item }) => (
        <PropertyCard property={item} textColor="text-" />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default RecentSearch;
