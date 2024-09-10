import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { data } from "@/data/tempData";
import { Place, AccommodationProperty } from "@/typesDeclaration/types";
import PropertyCard from "./PropertyCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Props {
  searchCriteria: {
    place: string;
    minRating: number;
    maxPrice: number;
  };
}

const RecentSearch: React.FC<Props> = ({ searchCriteria }) => {
  const { accommodations } = useSelector(
    (state: RootState) => state.accommodationsList
  );
  const [filteredHotels, setFilteredHotels] = useState<AccommodationProperty[]>(
    []
  );

  useEffect(() => {
    const results = accommodations
      .filter((place) =>
        place.location.city
          .toLowerCase()
          .includes(searchCriteria.place.toLowerCase())
      )
      .flatMap((place) => place.properties)
      .filter(
        (property) =>
          property.rating >= searchCriteria.minRating &&
          property.newPrice <= searchCriteria.maxPrice
      )
      .map((property) => ({
        id: property.id,
        name: property.name,
        propertyImage: property.propertyImage,
        rating: property.rating,
        address: property.address,
        oldPrice: property.oldPrice,
        newPrice: property.newPrice,
        latitude: property.latitude,
        longitude: property.longitude,
        photos: property.photos,
        rooms: property.rooms,
        registrationDate: property.registrationDate,
        distanceToPoint: property.distanceToPoint,
        propertyType: property.propertyType,
        reviews: property.reviews,
        reviewsRating: property.reviewsRating,
        description: property.description,
      }));
    setFilteredHotels(results);
  }, [searchCriteria]);

  return (
    <FlatList
      data={filteredHotels}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PropertyCard property={item} textColor="text-" />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default RecentSearch;
