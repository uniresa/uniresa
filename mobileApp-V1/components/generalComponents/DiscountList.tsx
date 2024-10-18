import { FlatList, Text } from "react-native";
import { AccommodationProperty } from "@/typesDeclaration/types";
import DiscountCard from "./DiscountCard";
import { getCheapestAccommodationPerCity } from "@/utils/discountedPriceCalculation";
import { useSelector } from "react-redux";
import { selectAccommodationsList } from "@/redux/slices/accommodationSlice";

const DiscountedList = () => {
  const { properties, loading, error } = useSelector(selectAccommodationsList);
  console.log("Properties fetched data:", properties);
  if (loading) {
    return <Text>Loading accommodations...</Text>;
  }

  if (error) {
    return <Text>Error loading accommodations: {error}</Text>;
  }

  if (!properties || properties.length === 0) {
    return <Text>No accommodations available</Text>;
  }
  const cheapestPerCity = getCheapestAccommodationPerCity(properties);
  console.log("cheapestPerCity final data:", cheapestPerCity);
  return (
    <FlatList
      data={cheapestPerCity}
      keyExtractor={(item) => item.cheapestProperty.propertyId}
      renderItem={({ item }) => (
        <DiscountCard discountedProperty={item} textColor="text-neutrals" />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default DiscountedList;
