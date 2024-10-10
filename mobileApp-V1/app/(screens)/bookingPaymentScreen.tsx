import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/generalComponents/CustomButton";
import moment from "moment";
import "moment/locale/fr";

const bookingPaymentScreen = () => {
  const params = useLocalSearchParams();
  const [parsedRooms, setParsedRooms] = useState<any[]>([]);
  const [parsedNights, setParsedNights] = useState<number>(1);
  const [parsedTotalToPay, setParsedTotalToPay] = useState<number>(0);
  const {
    totalToPay,
    checkInDate,
    checkOutDate,
    selectedRooms,
    property,
    bookingPerson,
    nights,
  } = params;

  const parsedCheckingDate = new Date(
    Array.isArray(checkInDate) ? checkInDate[0] : checkInDate
  );
  const freeCancellationExpiryDate = new Date(parsedCheckingDate);
  freeCancellationExpiryDate.setDate(parsedCheckingDate.getDate() - 2);

  useEffect(() => {
    try {
      if (selectedRooms) {
        const selectedRoomsString = Array.isArray(selectedRooms)
          ? selectedRooms[0]
          : selectedRooms;
        const parsedSelectedRooms = JSON.parse(selectedRoomsString);
        setParsedRooms(parsedSelectedRooms);
      }
      if (nights) {
        let nightsString = Array.isArray(nights) ? nights[0] : nights;
        const newNights = JSON.parse(nightsString);
        setParsedNights(newNights);
      }
      if (totalToPay) {
        let totalToPayString = Array.isArray(totalToPay)
          ? totalToPay[0]
          : totalToPay;
        const newTotalToPay = JSON.parse(totalToPayString);
        setParsedTotalToPay(newTotalToPay);
      }
    } catch (error) {
      console.error("Error parsing params:", error);
    }
  }, [selectedRooms, nights, totalToPay]);
  const pricePerNight = parsedTotalToPay / parsedNights;
  // , bookingPerson
  const handleBookingPayment = (paymentChannel: string) => {
    // Make API call to submit booking
    // Navigate to confirmation screen with booking details
    router.push({
      pathname: "/(screens)/bookingConfirmation",
      params: {
        totalToPay,
        checkInDate,
        checkOutDate,
        selectedRooms,
        property,
        bookingPerson,
        nights,
        paymentChannel,
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
          Options de paiement
        </Text>
      </View>
      <ScrollView>
        {/* Booking Payment Screen */}
        <Text className="text-lg font-bold text-neutrals-900 m-4">
          Entièrement remboursable avant le{" "}
          {moment(freeCancellationExpiryDate).format("ddd DD MMM")}
        </Text>
        {/* pay with uniresa */}
        <View className="m-4 border border-neutrals-100 rounded-xl bg-neutrals-20">
          <View className="p-2">
            <Text className="text-xl font-bold mb-1"> Payez avec Nous</Text>
            <View className="flex flex-row mb-1">
              <Image
                source={require("@/assets/icons/amenities/yesTick.png")}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />
              <Text className="text-base shrink text-justify text-neutrals-800">
                Payez votre reservation en plusieurs fois;
              </Text>
            </View>
            <View className="flex flex-row mb-1">
              <Image
                source={require("@/assets/icons/amenities/yesTick.png")}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />

              <Text className="text-base text-justify text-neutrals-800 shrink">
                Changez de logement, si l'hebergement ne repond pas à vos
                attentes à votre arrivée;
              </Text>
            </View>
            <View className="flex flex-row mb-1">
              <Image
                source={require("@/assets/icons/amenities/yesTick.png")}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />
              <Text className="text-base shrink text-justify text-neutrals-800">
                Payez par:{" "}
                <Text className="text-base font-semibold text-justify text-neutrals-800">
                  virement, Orange Money, MTN money;
                </Text>
              </Text>
            </View>
            <View className="flex flex-row mb-1">
              <Image
                source={require("@/assets/icons/amenities/yesTick.png")}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />
              <Text className="text-base shrink text-justify text-neutrals-800">
                Vous pouvez utiliser un bon uniresa valide;
              </Text>
            </View>
            <View className="flex flex-row mb-1">
              <Image
                source={require("@/assets/icons/amenities/yesTick.png")}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />
              <Text className="text-base shrink text-justify text-neutrals-800">
                Payez de votre portefeuille uniresa;
              </Text>
            </View>
          </View>
          <View className="items-end mr-4">
            <Text className="text-xl text-neutrals-900 font-bold mb-1">
              {parsedTotalToPay.toLocaleString("fr-FR", {
                style: "currency",
                currency: "XAF",
              })}
            </Text>
            <Text className=" text-base text-neutrals-800 mb-1">
              {parsedRooms.length > 1
                ? `${parsedRooms.length} hebergements`
                : `${parsedRooms.length} hebergement`}
              , {""}
              {parsedNights > 1
                ? `${parsedNights} nuits`
                : `${parsedNights} nuit`}
            </Text>
            <Text className=" text-base text-neutrals-800 mb-1">
              {pricePerNight.toLocaleString("fr-FR", {
                style: "currency",
                currency: "XAF",
              })}{" "}
              par nuit
            </Text>
          </View>
          <View className="p-4">
            <CustomButton
              title="Payer avec Uniresa"
              classNameTitle=""
              classNameLocal=""
              handlePress={() => handleBookingPayment("uniresa")}
            />
          </View>
        </View>
        {/* pay on spot*/}
        <View className="m-4 border border-neutrals-100 rounded-xl bg-neutrals-20">
          <View className="p-2">
            <Text className="text-xl font-bold mb-1">
              Payez au moment de votre séjour
            </Text>
            <View className="flex flex-row mb-1">
              <Image
                source={require("@/assets/icons/amenities/yesTick.png")}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />
              <Text className="text-base shrink text-justify text-neutrals-800">
                Payez 5% d'accompte maintenant le reste surplace;
              </Text>
            </View>
            <View className="flex flex-row mb-2">
              <Image
                source={require("@/assets/icons/amenities/yesTick.png")}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />
              <Text className="text-base shrink text-justify text-neutrals-800">
                Payez 95% en espèce à votre arrivée surplace
              </Text>
            </View>
          </View>
          <View className="items-end mr-4">
            <Text className="text-xl text-neutrals-900 font-bold mb-1">
              {parsedTotalToPay.toLocaleString("fr-FR", {
                style: "currency",
                currency: "XAF",
              })}
            </Text>
            <Text className=" text-base text-neutrals-800 mb-1">
              {parsedRooms.length > 1
                ? `${parsedRooms.length} hebergements`
                : `${parsedRooms.length} hebergement`}
              , {""}
              {parsedNights > 1
                ? `${parsedNights} nuits`
                : `${parsedNights} nuit`}
            </Text>
            <Text className=" text-base text-neutrals-800 mb-1">
              {pricePerNight.toLocaleString("fr-FR", {
                style: "currency",
                currency: "XAF",
              })}{" "}
              par nuit
            </Text>
          </View>

          <View className="p-4">
            <CustomButton
              title="Payer sur place"
              classNameTitle=""
              classNameLocal=""
              handlePress={() => handleBookingPayment("onSpot")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default bookingPaymentScreen;
