import { View, Text, Image, Animated, ImageBackground } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import CustomButton from "@/components/generalComponents/CustomButton";
import renderStars from "@/utils/renderStars";
import { AccommodationProperty } from "@/typesDeclaration/types";
import { Dimensions } from "react-native";
import { getAmenityIcon } from "@/utils/amenityIcon";

const { width } = Dimensions.get("window");
const accommodationOverviewPage = () => {
  const params = useLocalSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => {
    setIsExpanded((prevState) => !prevState); // Toggle between expanded and collapsed
  };
  let parsedProperty;
  try {
    if (params.property) {
      const propertyString = Array.isArray(params.property)
        ? params.property[0]
        : params.property;

      parsedProperty = JSON.parse(propertyString) as AccommodationProperty;
    } else {
      console.error("params.property is undefined or null");
      parsedProperty = {
        propertyName: "",
        description: "",
        numberOfStars: 0,
        images: [],
        amenities: [],
      };
    }
  } catch (error) {
    console.error("Failed to parse property:", error);
    parsedProperty = {
      propertyName: "",
      description: "",
      numberOfStars: 0,
      images: [],
      amenities: [],
    }; // Default value
  }
  const {
    propertyName,
    description,
    numberOfStars,
    images,
    amenities,
    tagMessage,
  } = parsedProperty;
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current image index
  const scrollX = useRef(new Animated.Value(0)).current; // For horizontal scrolling

  // Interpolation to show/hide property name based on scroll position
  const propertyNameOpacity = scrollY.interpolate({
    inputRange: [0, 70], // adjust the second value to control when the property name fades
    outputRange: [0, 1], // not visible at top, appears as you scroll
    extrapolate: "clamp",
  });
  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: any } };
  }) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width); // Update the current index based on scroll position
    setCurrentIndex(index);
  };
  return (
    <SafeAreaView className="flex-1 bg-neutrals-20">
      {/* Fixed Header */}
      <View className="flex flex-row justify-between bg-primary p-6">
        <View className="flex flex-row gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="items-start justify-center ml-4"
          >
            <Image
              source={require("@/assets/icons/arrowWhite.png")}
              className=" w-8 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* Animated property name */}
          <Animated.Text
            style={{
              fontSize: 20,
              color: "#ffffff",
              opacity: propertyNameOpacity, // Only the text opacity changes
            }}
          >
            {propertyName}
          </Animated.Text>
        </View>
        <View className="flex flex-row items-end justify-center gap-6 mr-4">
          <TouchableOpacity onPress={() => router.push("/searchResultsPage")}>
            <Image
              source={require("@/assets/icons/heartWhite.png")}
              className=" w-8 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/searchResultsPage")}>
            <Image
              source={require("@/assets/icons/shareIconWhite.png")}
              className=" w-8 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Scrollable Content */}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // `false` to avoid layout conflicts with animations
        )}
        scrollEventThrottle={16}
      >
        <View className="mt-4 px-2">
          <Text className="font-bold text-3xl text-neutrals-900">
            {propertyName}
          </Text>
          <View className="flex flex-row items-center gap-1 mt-1">
            {renderStars(numberOfStars, 24)}
          </View>
          <Text
            className="text-neutrals-800 my-4 font-semibold text-xl text-justify"
            numberOfLines={4}
          >
            {tagMessage}
          </Text>
          {/* FlatList to render images */}
          <View className="flex flex-row w-full justify-between mt-2">
            <FlatList
              data={images}
              keyExtractor={(item, index) => index.toString()}
              onScroll={handleScroll}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              // contentContainerStyle={{ paddingHorizontal: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {}}>
                  <ImageBackground
                    source={{ uri: item, cache: "force-cache" }}
                    className="h-[300px] w-full mx-1"
                    style={{ width: width }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            />
            <View className="absolute right-0 bottom-0 bg-neutrals-800 p-2">
              <Text className="text-base text-neutrals">
                {images.length} photos
              </Text>
            </View>
          </View>
          {/* Custom Image Indicator */}
          <View className="flex flex-row justify-center mt-4">
            {images.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  marginHorizontal: 5,
                  backgroundColor: currentIndex === index ? "#ffa500" : "gray",
                }}
              />
            ))}
          </View>
          <View className="mt-6">
            <Text className="text-neutrals-900 font-bold text-2xl mb-4 flex-wrap">
              Equipements populaires
            </Text>
            <View className="flex flex-row flex-wrap justify-between mx-1">
              {amenities
                .filter((amenity) => amenity.isAvailable && amenity.isPopular)
                .map((amenity, index) => {
                  const icon = getAmenityIcon(amenity.amenityName);
                  return (
                    <View
                      key={index}
                      className="w-[48%] mb-4 flex flex-row items-center"
                    >
                      {icon && (
                        <Image
                          source={icon}
                          className="w-6 h-6 mr-1"
                          resizeMode="contain"
                        />
                      )}
                      <Text className="text-neutrals-800 text-xl">
                        {amenity.amenityName}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>
          <View className="mt-6">
            <Text className="text-neutrals-900 font-bold text-2xl mb-4 flex-wrap">
              Decovrez la zone
            </Text>
            <View>{/* Add the map component here */}</View>
          </View>
          <View className="mt-6">
            <Text className="text-neutrals-900 font-bold text-2xl mb-4 flex-wrap">
              Description de l'hebergement
            </Text>
            <View>
              <Text
                className="text-neutrals-800  text-xl text-justify"
                numberOfLines={isExpanded ? undefined : 4}
              >
                {description}
              </Text>
              <TouchableOpacity onPress={toggleExpanded}>
                <Text className="text-warning-600 text-xl my-4">
                  {isExpanded ? "Voir moins" : "Voir la description complete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="mt-6">
            <Text className="text-neutrals-900 font-bold text-2xl mb-4 flex-wrap">
              Conditions
            </Text>
            <View>
              <Text
                className="text-neutrals-800  text-xl text-justify"
                numberOfLines={isExpanded ? undefined : 4}
              >
                {description}
              </Text>
              <TouchableOpacity onPress={toggleExpanded}>
                <Text className="text-warning-600 text-xl my-4">
                  {isExpanded ? "Voir moins" : "Voir la description complete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="mt-6">
            <Text className="text-neutrals-900 font-bold text-2xl mb-4 flex-wrap">
              Informations importantes
            </Text>
            <View>
              <Text
                className="text-neutrals-800  text-xl text-justify"
                numberOfLines={isExpanded ? undefined : 4}
              >
                {description}
              </Text>
              <TouchableOpacity onPress={toggleExpanded}>
                <Text className="text-warning-600 text-xl my-4">
                  {isExpanded ? "Voir moins" : "Voir la description complete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      {/* Fixed Footer */}
      <View className="mx-4 my-4">
        <CustomButton
          title="Sélectionner une chambre"
          classNameTitle="text-2xl font-lbold"
        />
      </View>
    </SafeAreaView>
  );
};

export default accommodationOverviewPage;
