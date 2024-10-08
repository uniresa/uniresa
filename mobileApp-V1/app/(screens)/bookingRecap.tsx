import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { AccommodationProperty, BookingPerson } from "@/typesDeclaration/types";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/generalComponents/CustomButton";
import renderStars from "@/utils/renderStars";
import moment from "moment";
import "moment/locale/fr";

const { width } = Dimensions.get("window");

const bookingRecap = () => {
  const params = useLocalSearchParams();
  const [parsedRooms, setParsedRooms] = useState<any[]>([]);
  const [parsedBookingPerson, setParsedBookingPerson] =
    useState<BookingPerson | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    reservationTotalPrice,
    checkInDate,
    checkOutDate,
    selectedRooms,
    property,
    bookingPerson,
  } = params;

  const actualCheckInDate = new Date(
    Array.isArray(checkInDate) ? checkInDate[0] : checkInDate
  );
  const actualCheckOutDate = new Date(
    Array.isArray(checkOutDate) ? checkOutDate[0] : checkOutDate
  );
  // Calculate the number of nights
  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  const nights = Math.round(
    Math.abs(
      (actualCheckInDate.getTime() - actualCheckOutDate.getTime()) / oneDay
    )
  );
  // Parse bookingPerson if received from bookingPersonForm screen
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
        additionalCost: "",
        additionalServices: "",
        roomTypes: [
          {
            roomId: "",
            type: "", // Example: "Double Room", "Suite", etc.
            surface: 0, // surface
            capacity: 1, // Number of people the room can accommodate
            priceDetails: [],
            roomAvailabilities: [], // Availability details by date range
            discountList: [],
            ongoingDiscountPercentages: [],
            isRefundable: true,
            amenities: [],
            roomImages: [],
            roomBookings: [],
            roomDescription: "",
            bedType: "",
          },
        ],
        // policies: [],
        checkInDetails: {
          checkIn: "",
          checkOut: "",
          checkInInfo: "",
          propertyAccesDetails: "",
          paymentMethods: "",
          pets: "",
        },
        location: {
          street: "",
          quartier: "", // Specific area within a city
          city: "",
          district: "",
          region: "",
          postalCode: "",
          country: "",
          latitude: 3.865, // Geographical latitude
          longitude: 11.5161, // Geographical longitude
        },
      };
    }
  } catch (error) {
    console.error("Failed to parse property:", error);
    parsedProperty = {
      propertyName: "",
      description: "",
      numberOfStars: 0,
      additionalCost: "",
      additionalServices: "",
      roomTypes: [
        {
          roomId: "",
          type: "", // Example: "Double Room", "Suite", etc.
          surface: 0, // surface
          capacity: 1, // Number of people the room can accommodate
          priceDetails: [],
          roomAvailabilities: [], // Availability details by date range
          discountList: [],
          ongoingDiscountPercentages: [],
          isRefundable: true,
          amenities: [],
          roomImages: [],
          roomBookings: [],
          roomDescription: "",
          bedType: "",
        },
      ],
      images: [],
      amenities: [],
      checkInDetails: {
        checkIn: "",
        checkOut: "",
        checkInInfo: "",
        propertyAccesDetails: "",
        paymentMethods: "",
        pets: "",
      },
      location: {
        street: "",
        quartier: "", // Specific area within a city
        city: "",
        district: "",
        region: "",
        postalCode: "",
        country: "",
        latitude: 3.865, // Geographical latitude
        longitude: 11.5161, // Geographical longitude
      },
    }; // Default value
  }
  const {
    propertyName,
    description,
    numberOfStars,
    images,
    amenities,
    tagMessage,
    location,
    policies,
    checkInDetails,
    additionalCost,
    additionalServices,
    priceDetails,
    finalCleaning,
    roomTypes,
  } = parsedProperty;
  useEffect(() => {
    try {
      if (selectedRooms) {
        const selectedRoomsString = Array.isArray(selectedRooms)
          ? selectedRooms[0]
          : selectedRooms;
        const parsedSelectedRooms = JSON.parse(selectedRoomsString);
        setParsedRooms(parsedSelectedRooms);
      }
      if (bookingPerson) {
        const bookingPersonString = Array.isArray(bookingPerson)
          ? bookingPerson[0]
          : bookingPerson;
        const parsedBookingP = JSON.parse(bookingPersonString) as BookingPerson;
        setParsedBookingPerson(parsedBookingP);
      }
    } catch (error) {
      console.error("Error parsing params:", error);
    }
  }, [selectedRooms, bookingPerson]);

  const moveToPayment = () => {};
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
      <View className="flex flex-row  bg-primary p-6 gap-4">
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

        <Text className="font-bold text-white text-lg text-center">
          Synthèse de la réservation
        </Text>
      </View>
      {/* Booking Recap */}
      <ScrollView>
        <View className="p-4  border-2 border-neutrals-100">
          {/* <View className="items-center mb-4"> */}
          <View className="flex flex-row w-full justify-between rounded-t-3xl overflow-hidden mb-4">
            {images.length > 0 ? (
              <FlatList
                data={images}
                keyExtractor={(item, index) => index.toString()}
                onScroll={handleScroll}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => {}}>
                    <ImageBackground
                      source={{ uri: item, cache: "force-cache" }}
                      style={{
                        height: 200,
                        width: width,
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text>No images available</Text>
            )}
            {/* Custom Image Indicator */}
            <View className="absolute left-0 right-0 bottom-2 flex-row justify-center">
              <View className="flex-row space-x-2">
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={{
                      height: 16,
                      width: 16,
                      borderRadius: 10,
                      backgroundColor:
                        currentIndex === index ? "#FFA500" : "#D3D3D3",
                      marginHorizontal: 2,
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
          {/* property details */}
          <View className="gap-2 border border-b-2 border-neutrals-300">
            <View className="flex flex-row items-center gap-4">
              <Text className={"text-lg font-semibold"}>{propertyName}</Text>
              <View className="flex flex-row items-center">
                {renderStars(numberOfStars)}
              </View>
            </View>
            <Text className="text-lg text-neutrals-800">{tagMessage}</Text>
          </View>
          <View className="justify-start gap-2 border border-b-2 border-neutrals-300">
            <Text className="text-lg text-neutrals-800 mb-2">
              <Text className="font-bold text-xl text-neutrals-900">
                {" "}
                Arrivée:{" "}
              </Text>{" "}
              {moment(checkInDate).format("ddd DD MMM")}
            </Text>
            <Text className="text-lg text-neutrals-800">
              <Text className="font-bold text-xl text-neutrals-900">
                {" "}
                Départ:{" "}
              </Text>{" "}
              {moment(checkOutDate).format("ddd DD MMM")}
            </Text>
            <Text className=" text-xl text-neutrals-900">
              Sejour de {nights} nuits
            </Text>
            <Text className=" text-xl text-neutrals-900">
              Pour{" "}
              {parsedRooms.length > 1
                ? `${parsedRooms.length} hebergements`
                : `${parsedRooms.length} hebergement`}
              : {""}
              {parsedRooms &&
                parsedRooms.map((room) => (
                  <Text className="font-semibold text-neutrals-900">
                    {""}
                    {room.roomName}
                  </Text>
                ))}
            </Text>
          </View>
        </View>
      </ScrollView>
      {/* Fixed Footer */}
      <View className="mx-4 my-4">
        <View className="my-2">
          <Text className="text-xl text-neutrals-900 font-bold">
            XAF {reservationTotalPrice} Pour {""}
            {parsedRooms.length > 1
              ? `${parsedRooms.length} hebergements`
              : `${parsedRooms.length} hebergement`}
          </Text>

          <Text className="text-lg text-neutrals-800">
            Taxes et frais compris
          </Text>
        </View>
        <CustomButton
          title="Derniere étape"
          classNameTitle=""
          classNameLocal=""
          handlePress={moveToPayment}
        />
      </View>
    </SafeAreaView>
  );
};

export default bookingRecap;
