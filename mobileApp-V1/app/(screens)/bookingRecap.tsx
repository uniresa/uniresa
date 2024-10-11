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

type SelectedRoom = {
  roomId: string;
  roomTotalPrice: number;
  roomName: string;
};

const bookingRecap = () => {
  const params = useLocalSearchParams();
  const [parsedRooms, setParsedRooms] = useState<SelectedRoom[]>([]);
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

  //adminFee calculation 1%
  const parsedReservationTotalPrice = Array.isArray(reservationTotalPrice)
    ? parseFloat(reservationTotalPrice[0])
    : parseFloat(reservationTotalPrice);
  const adminFee: number = parsedReservationTotalPrice / 100;

  const totalToPay = adminFee + parsedReservationTotalPrice;

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
        additionalInfo: "",
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
      additionalInfo: "",
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
    cancellationPolicy,
    images,
    amenities,
    tagMessage,
    additionalInfo,
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
  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: any } };
  }) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width); // Update the current index based on scroll position
    setCurrentIndex(index);
  };

  const moveToPayment = () => {
    router.push({
      pathname: "/bookingPaymentScreen",
      params: {
        totalToPay,
        checkInDate,
        checkOutDate,
        selectedRooms,
        property,
        bookingPerson,
        nights,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-neutrals-20">
      {/* Fixed Header */}
      <View className="flex flex-row  bg-primary p-6 gap-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="items-start justify-center ml-4"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
        <View className="m-4 mb-4 border border-neutrals-100 rounded-t-3xl overflow-hidden">
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
                      height: 12,
                      width: 12,
                      borderRadius: 8,
                      backgroundColor:
                        currentIndex === index ? "#ffa500" : "#c0c0c0",
                      marginHorizontal: 1,
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
          {/* property details */}
          <View className="border-b border-neutrals-100 p-3">
            <View className="flex flex-row gap-4 mb-2">
              <Text className={"text-xl font-semibold"}>{propertyName}</Text>
              <View className="flex flex-row items-center">
                {renderStars(numberOfStars)}
              </View>
            </View>
            <Text className="text-base font-semibold text-justify text-neutrals-800">
              {tagMessage}
            </Text>
          </View>
          <View className=" p-3">
            <Text className="text-lg text-neutrals-800 mb-1">
              <Text className="font-bold text-lg text-neutrals-900">
                Arrivée:{" "}
              </Text>{" "}
              {moment(checkInDate).format("ddd DD MMM")}
            </Text>
            <Text className="text-lg text-neutrals-800 mb-1">
              <Text className="font-bold text-lg text-neutrals-900">
                Départ:{" "}
              </Text>{" "}
              {moment(checkOutDate).format("ddd DD MMM")}
            </Text>
            <Text className=" text-lg text-neutrals-900">
              Séjour de {nights} nuits
            </Text>
            <Text className=" text-lg text-neutrals-900 mb-1">
              Pour{" "}
              {parsedRooms.length > 1
                ? `${parsedRooms.length} hebergements`
                : `${parsedRooms.length} hebergement`}
              : {""}
              {parsedRooms &&
                parsedRooms.map((room) => (
                  <Text
                    key={room.roomId}
                    className="font-semibold text-lg text-neutrals-900"
                  >
                    {""}
                    {room.roomName},{" "}
                  </Text>
                ))}
            </Text>
          </View>
        </View>
        <View className="items-center border border-neutrals-100 m-4">
          {parsedRooms.length > 1 ? (
            <View className="flex flex-row items-center justify-between w-full ">
              <Image
                source={require("@/assets/icons/greenYesIcon.png")}
                className="w-6 h-6 mx-2"
                resizeMode="contain"
              />
              <Text className="text-secondary-800 text-base font-semibold text-justify flex flex-wrap">
                Excellent choix ! Reservez ces hebergements dès maintenant avant
                qu'ils n'affichent complets
              </Text>
            </View>
          ) : (
            <View className="flex flex-row items-center justify-between w-full p-2 ">
              <Image
                source={require("@/assets/icons/greenYesIcon.png")}
                className="w-6 h-6 mr-1"
                resizeMode="contain"
              />
              <Text className="text-secondary text-base font-semibold text-justify flex flex-wrap">
                Excellent choix ! Reservez cet hebergement dès maintenant avant
                qu'il n'affiche complet
              </Text>
            </View>
          )}
        </View>
        {/* Price Details */}
        <View className="border border-neutrals-100 m-4  ">
          <View className="border-b border-neutrals-100 p-3">
            <Text className="text-xl font-bold text-neutrals-900">
              Détails du prix
            </Text>
          </View>
          <View className="border-b border-neutrals-100  p-3">
            <View className="flex flex-row justify-between mb-2">
              <View className="justify-start">
                <Text className="text-lg  text-neutrals-800">
                  {parsedRooms.length > 1 ? (
                    <Text className="text-lg  text-neutrals-800">
                      {parsedRooms.length} chambres x{" "}
                      {nights > 1 ? (
                        <Text className="text-lg  text-neutrals-800">
                          {nights} nuits
                        </Text>
                      ) : (
                        <Text className="text-lg  text-neutrals-800">
                          {nights} nuit
                        </Text>
                      )}
                    </Text>
                  ) : (
                    <Text className="text-lg  text-neutrals-800">
                      {parsedRooms.length} chambre x{" "}
                      {nights > 1 ? (
                        <Text className="text-lg  text-neutrals-800">
                          {nights} nuits
                        </Text>
                      ) : (
                        <Text className="text-lg  text-neutrals-800">
                          {nights} nuit
                        </Text>
                      )}
                    </Text>
                  )}
                </Text>
              </View>
              <View className="justify-end">
                <Text className="text-lg font-semibold text-neutrals-800">
                  {parsedReservationTotalPrice.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "XAF",
                  })}
                </Text>
              </View>
            </View>
            <View className="flex flex-row justify-between">
              <View className="justify-start">
                <Text className="text-lg  text-neutrals-800">
                  Frais de dossier
                </Text>
              </View>
              <View className="justify-end">
                <Text className="text-lg font-semibold text-neutrals-800">
                  {adminFee.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "XAF",
                  })}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex flex-row justify-between p-3">
            <View className="items-start">
              <Text className="text-lg font-bold text-neutrals-800">
                Total :
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-lg font-bold text-neutrals-800">
                {totalToPay.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "XAF",
                })}
              </Text>
            </View>
          </View>
        </View>
        <View className=" m-4 p-3 border border-neutrals-100">
          <Text className="text-xl font-bold text-neutrals-900">
            Politique d’annulation
          </Text>
          <View className="flex flex-row my-1">
            <Image
              source={require("@/assets/icons/amenities/yesTick.png")}
              className="w-6 h-6 mr-2"
              resizeMode="contain"
            />
            {cancellationPolicy && (
              <Text className="shrink text-base  text-neutrals-800 text-justify">
                {cancellationPolicy}
              </Text>
            )}
          </View>
        </View>
        <View className=" m-4 border border-neutrals-100 p-3">
          <Text className="ml-2 text-xl font-bold text-neutrals-900">
            Informations importantes
          </Text>
          <View className="mt-4">
            <View className="flex flex-row my-1">
              <Image
                source={require("@/assets/icons/amenities/yesTick.png")}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />
              {additionalInfo && (
                <Text className="shrink text-base text-justify text-neutrals-800">
                  {additionalInfo}
                </Text>
              )}
            </View>
            <View className="flex flex-row my-1">
              <Image
                source={require("@/assets/icons/amenities/yesTick.png")}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />
              {additionalCost && (
                <Text className="shrink text-lg text-justify text-neutrals-800 my-1">
                  {additionalCost}
                </Text>
              )}
            </View>
            <View className="flex flex-row my-1">
              <Image
                source={require("@/assets/icons/amenities/yesTick.png")}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />
              {additionalServices && (
                <Text className="shrink text-lg text-justify text-neutrals-800 my-1">
                  {additionalServices}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Fixed Footer */}
      <View className="mx-4 my-4">
        <View className="my-2">
          <Text className="text-xl text-neutrals-900 font-bold">
            {totalToPay.toLocaleString("fr-FR", {
              style: "currency",
              currency: "XAF",
            })}{" "}
            Pour {""}
            {parsedRooms.length > 1
              ? `${parsedRooms.length} hebergements`
              : `${parsedRooms.length} hebergement`}
          </Text>

          <Text className="text-lg text-neutrals-800">
            Taxes et frais compris
          </Text>
        </View>
        <CustomButton
          title="Reserver"
          classNameTitle=""
          classNameLocal=""
          handlePress={moveToPayment}
        />
      </View>
    </SafeAreaView>
  );
};

export default bookingRecap;
