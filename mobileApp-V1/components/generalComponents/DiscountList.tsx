import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { data } from "@/data/tempData"; // Assuming this is your data source
import { AccommodationProperty } from "@/typesDeclaration/types";
import DiscountCard from "./DiscountCard";

const DiscountedList: React.FC = () => {
  const [topDiscountedHotels, setTopDiscountedHotels] = useState<
    { place: string; property: AccommodationProperty }[]
  >([]);

  useEffect(() => {
    const results = data
      .map((place) => {
        const discountedProperties = place.properties.filter(
          (property) => property.newPrice < property.oldPrice
        );

        if (discountedProperties.length > 0) {
          const biggestDiscountProperty = discountedProperties.reduce(
            (max, property) => {
              const discountAmount = property.oldPrice - property.newPrice;
              const maxDiscountAmount = max.oldPrice - max.newPrice;
              return discountAmount > maxDiscountAmount ? property : max;
            }
          );

          return {
            place: place.place,
            property: biggestDiscountProperty,
          };
        }

        return null;
      })
      .filter((result) => result !== null);

    setTopDiscountedHotels(results as { place: string; property: Property }[]);
  }, []);

  return (
    <FlatList
      data={topDiscountedHotels}
      keyExtractor={(item) => item.place}
      renderItem={({ item }) => (
        <DiscountCard discountedProperty={item} textColor="text-neutrals" />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default DiscountedList;
