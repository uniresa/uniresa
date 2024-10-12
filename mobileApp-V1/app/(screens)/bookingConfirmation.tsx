import axios from "axios";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/generalComponents/CustomButton";
import RadioButton from "@/components/generalComponents/RadioButton";
import { useSelector } from "react-redux";
import { loggedInUser } from "@/redux/slices/userSlice";
import moment from "moment";
import "moment/locale/fr";
import {
  AccommodationProperty,
  BookingPerson,
  BookingRequest,
  SelectedRoom,
} from "@/typesDeclaration/types";

const allowedPropertyTypes = [
  "Hotel",
  "Bungalow",
  "Furnished Apartment",
  "Furnished House",
  "Villa",
  "Cottage",
  "Guesthouse",
  "Hostel",
  "Resort",
] as const;

const bookingConfirmation = () => {
  const backendApi = process.env.EXPO_PUBLIC_BASE_URL;
  const { user } = useSelector(loggedInUser);
  const params = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<string>("portefeuille");
  const [parsedRooms, setParsedRooms] = useState<SelectedRoom[]>([]);
  const [parsedNights, setParsedNights] = useState<number>(1);
  const [parsedTotalToPay, setParsedTotalToPay] = useState<number>(0);
  const [parsedBookingPerson, setParsedBookingPerson] = useState<BookingPerson>(
    {
      firstName: "",
      surName: "",
      email: "",
      phoneNumber: "",
      address: {
        street: "",
        quartier: "",
        city: "",
        district: "",
        region: "",
        postalCode: "",
        country: "",
      },
      birthDate: "",
      accountBalance: { amount: 0, currency: "" },
    }
  );
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const {
    totalToPay,
    checkInDate,
    checkOutDate,
    selectedRooms,
    property,
    bookingPerson,
    nights,
    paymentChannel,
  } = params;
  const parsedPaymentChannel = Array.isArray(paymentChannel)
    ? paymentChannel[0]
    : paymentChannel;
  const parsedCheckinDate = new Date(
    Array.isArray(checkInDate) ? checkInDate[0] : checkInDate
  );

  // checkin and checkout as string
  const parsedCheckInDateString = Array.isArray(checkInDate)
    ? checkInDate[0]
    : checkInDate;

  const parsedCheckOutDateString = Array.isArray(checkOutDate)
    ? checkOutDate[0]
    : checkOutDate;

  const freeCancellationExpiryDate = new Date(parsedCheckinDate);
  freeCancellationExpiryDate.setDate(parsedCheckinDate.getDate() - 2);
  const prepayment = (parsedTotalToPay * 5) / 100;
  const downpayment = (parsedTotalToPay * 95) / 100;
  let parsedProperty;
  try {
    if (property) {
      const propertyString = Array.isArray(property) ? property[0] : property;
      parsedProperty = JSON.parse(propertyString) as AccommodationProperty;
      parsedProperty.propertyType;
    } else {
      console.error("params.property is undefined or null");
      parsedProperty = {
        propertyId: "",
        propertyName: "",

        additionalCost: "",
        additionalServices: "",
        additionalInfo: "",
      };
    }
  } catch (error) {
    console.error("Failed to parse property:", error);
    parsedProperty = {
      propertyId: "",
      propertyName: "",
      additionalCost: "",
      additionalServices: "",
      additionalInfo: "",
    }; // Default value
  }
  const {
    propertyId,
    propertyName,
    propertyType,
    cancellationPolicy,
    additionalInfo,
    additionalCost,
    additionalServices,
  } = parsedProperty;
  const propertyTypeChecked =
    propertyType && allowedPropertyTypes.includes(propertyType)
      ? propertyType
      : "Hotel";

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
      if (bookingPerson) {
        let totalToPayString = Array.isArray(bookingPerson)
          ? bookingPerson[0]
          : bookingPerson;
        const newBookingPerson = JSON.parse(totalToPayString) as BookingPerson;
        setParsedBookingPerson(newBookingPerson);
      }
    } catch (error) {
      console.error("Error parsing params:", error);
    }
  }, [selectedRooms, nights, totalToPay]);
  const userBalance = user ? user.accountBalance.amount : 0;
  const pricePerNight = parsedTotalToPay / parsedNights;
  const specificRoomTypeIds: string[] = parsedRooms.map((room) => room.roomId);
  const formattedCheckInDate = moment(parsedCheckInDateString).format(
    "MM/DD/YYYY"
  );
  const formattedCheckOutDate = moment(parsedCheckOutDateString).format(
    "MM/DD/YYYY"
  );
  const bookingPayload: BookingRequest = {
    propertyId,
    propertyName,
    specificRoomTypeIds,
    propertyType: propertyTypeChecked,
    bookingDates: {
      checkInDate: formattedCheckInDate,
      checkOutDate: formattedCheckOutDate,
    },
    totalAmount: parsedTotalToPay,
    currency: "FCFA",
    paymentStatus: "Pending",
    bookingType: "customer",
    bookingChannel: "mobileApp",
    bookingStatus: "Pending",
    bookingPerson: parsedBookingPerson,
    paymentMethod: selectedMethod,
    paymentChannel: parsedPaymentChannel,
    paidAmount: paidAmount,
    specialRequests: ["No special requests"],
  };

  const handleBookingSubmit = async () => {
    try {
      const res = await axios.post(
        `${backendApi}/api/bookings/createBookings`,
        bookingPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = await res.data;
      if (data.status === "success") {
        Alert.alert(
          "Confirmation de la réservation",
          "Votre réservation a été prise en compte. Un email de confirmation vous a été envoyé avec toutes les informations nécessaires.",
          [
            {
              text: "Ok",
              onPress: () => router.push("/(tabs)/home"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Erreur",
          "Une erreur s'est produite lors de la réservation."
        );
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la réservation.");
    }
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
          Confirmation de la reservation
        </Text>
      </View>
      <ScrollView>
        <View>
          {parsedPaymentChannel === "uniresa" ? (
            <View className="m-4 ">
              <Text className="text-neutrals-900 text-lg font-bold ">
                Vous avez choisi de payer avec uniresa
              </Text>
              <Text className="text-neutrals-800 text-base">
                Vous avez un accompte de 5% soit{" "}
                <Text className="text-neutrals-900 text-lg font-bold">
                  {prepayment.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "XAF",
                  })}
                </Text>{" "}
                à regler dans les 3 prochains jours
              </Text>
              <Text>
                Vous pouvez echelonner le solde de{" "}
                <Text className="text-neutrals-900 text-lg font-bold">
                  {downpayment.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "XAF",
                  })}
                </Text>{" "}
                en{" "}
                <Text className="text-neutrals-800 text-base font-semibold">
                  une ou plusieurs mensualités
                </Text>
              </Text>
              <Text className="text-neutrals-800 text-base font-semibold my-2">
                Choisissez un moyen de paiement et confirmez la reservation
              </Text>
              <View className="border border-neutrals-100 my-4 rounded-lg">
                <Text className="text-neutrals-900 font-bold text-xl p-2">
                  Moyens de paiement
                </Text>
                <View className=" p-2 border-b border-b-neutrals-100">
                  <RadioButton
                    title="Portefeuille uniresa"
                    selected={selectedMethod === "portefeuille"}
                    onPress={() => setSelectedMethod("portefeuille")}
                  />
                  <RadioButton
                    title="Mobile Money"
                    selected={selectedMethod === "mobileMoney"}
                    onPress={() => setSelectedMethod("mobileMoney")}
                  />
                  <RadioButton
                    title="Transfert Bancaire"
                    selected={selectedMethod === "bankTransfer"}
                    onPress={() => setSelectedMethod("bankTransfer")}
                  />
                  <RadioButton
                    title="Paypal"
                    selected={selectedMethod === "paypal"}
                    onPress={() => setSelectedMethod("paypal")}
                  />
                </View>
                <View>
                  {selectedMethod === "portefeuille" ? (
                    <View className="m-4">
                      <Text className="text-neutrals-800 font-bold text-justify text-base my-4">
                        Solde de votre compte: {""}
                        <Text className="text-secondary-600 font-bold text-lg ">
                          {userBalance.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "XAF",
                          })}
                        </Text>
                      </Text>

                      {(user && userBalance > prepayment) ||
                      userBalance === prepayment ? (
                        <View className="p-2">
                          <View className="flex flex-row mb-1">
                            <Image
                              source={require("@/assets/icons/amenities/yesTick.png")}
                              className="w-6 h-6 mr-2"
                              resizeMode="contain"
                            />
                            <Text className="text-neutrals-800 shrink text-justify text-base">
                              Vous serrez debité de{" "}
                              <Text className="text-neutrals-900 font-bold text-lg">
                                {prepayment.toLocaleString("fr-FR", {
                                  style: "currency",
                                  currency: "XAF",
                                })}
                              </Text>{" "}
                              representant 5% d'accompte
                            </Text>
                          </View>
                          <View className="flex flex-row mb-1">
                            <Image
                              source={require("@/assets/icons/amenities/yesTick.png")}
                              className="w-6 h-6 mr-2"
                              resizeMode="contain"
                            />
                            <Text className="text-neutrals-800 shrink text-justify text-base">
                              Le solde de{" "}
                              <Text className="text-neutrals-900 font-bold text-lg">
                                {downpayment.toLocaleString("fr-FR", {
                                  style: "currency",
                                  currency: "XAF",
                                })}
                              </Text>{" "}
                              due au plutard le{" "}
                              {moment(freeCancellationExpiryDate).format(
                                "ddd DD MMM"
                              )}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View className="p-2">
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Votre solde est insuffisant veuillez recharger votre
                            compte ou utiliser un autre moyen de paiment.
                          </Text>

                          <View className="flex flex-row mb-1">
                            <Image
                              source={require("@/assets/icons/amenities/yesTick.png")}
                              className="w-6 h-6 mr-2"
                              resizeMode="contain"
                            />
                            <Text className="text-neutrals-800 shrink font-semibold  text-justify text-base">
                              Accompte: {""}
                              <Text className="text-neutrals-900 font-bold text-lg">
                                {prepayment.toLocaleString("fr-FR", {
                                  style: "currency",
                                  currency: "XAF",
                                })}
                              </Text>{" "}
                            </Text>
                          </View>
                          <View className="flex flex-row mb-1">
                            <Image
                              source={require("@/assets/icons/amenities/yesTick.png")}
                              className="w-6 h-6 mr-2"
                              resizeMode="contain"
                            />
                            <Text className="text-neutrals-800 font-semibold shrink text-justify text-base">
                              Solde:{" "}
                              <Text className="text-neutrals-900 font-bold text-lg">
                                {downpayment.toLocaleString("fr-FR", {
                                  style: "currency",
                                  currency: "XAF",
                                })}
                              </Text>{" "}
                              due au plutard le{" "}
                              {moment(freeCancellationExpiryDate).format(
                                "ddd DD MMM"
                              )}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  ) : selectedMethod === "mobileMoney" ? (
                    <View className="m-4">
                      <View className="flex flex-row mb-2 items-start">
                        <Image
                          source={require("@/assets/images/orangeMoney.png")}
                          className="w-16 h-12 mx-2"
                        />
                        <Image
                          source={require("@/assets/images/mtnMobileMoney.png")}
                          className="w-16 h-12 mx-2"
                        />
                      </View>
                      <Text className="text-neutrals-800 text-justify text-base mb-1">
                        Une fois votre reservation confirmee, Vous recevrez les
                        instructions pour le transfert OM ou MoMo sur votre
                        confirmation de reservation en page 2.
                      </Text>
                      <Text className="text-neutrals-800 font-semibold text-justify text-base mb-2">
                        Veuillez mentionner votre numéro de reservation lors de
                        l'envoie.
                      </Text>
                      <View className="mb-1">
                        <Text className="text-neutrals-800 shrink text-justify text-base">
                          N'hesitez pas de joindre notre service client en cas
                          de besoin:
                        </Text>
                        <View className="flex flex-row mb-1">
                          <Image
                            source={require("@/assets/icons/amenities/yesTick.png")}
                            className="w-6 h-6 mr-2"
                            resizeMode="contain"
                          />
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Par email:{" "}
                            <Text className="text-neutrals-900 font-bold text-lg">
                              contact@uniresa.com
                            </Text>
                          </Text>
                        </View>
                        <View className="flex flex-row mb-1">
                          <Image
                            source={require("@/assets/icons/amenities/yesTick.png")}
                            className="w-6 h-6 mr-2"
                            resizeMode="contain"
                          />
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Par whatsApp:{" "}
                            <Text className="text-neutrals-900 font-bold text-lg">
                              lien whatsApp
                            </Text>
                          </Text>
                        </View>
                        <View className="flex flex-row mb-1">
                          <Image
                            source={require("@/assets/icons/amenities/yesTick.png")}
                            className="w-6 h-6 mr-2"
                            resizeMode="contain"
                          />
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Par Appel direct:{" "}
                            <Text className="text-neutrals-900 font-bold text-lg">
                              +237 670 86 41 08
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : selectedMethod === "bankTransfer" ? (
                    <View className="m-4">
                      <Text className="text-neutrals-800 text-justify text-base mb-1">
                        Une fois votre reservation confirmee, Vous recevrez
                        notre RIB (Rélévé d'identité bancaire) avec toutes les
                        informations necessaires pour le paiement.
                      </Text>
                      <Text className="text-neutrals-800 font-semibold text-justify text-base mb-2">
                        Veuillez mentionner votre numéro de reservation comme
                        raison du virement
                      </Text>
                      <View className="mb-1">
                        <Text className="text-neutrals-800 shrink text-justify text-base">
                          N'hesitez pas de joindre notre service client en cas
                          de besoin:
                        </Text>
                        <View className="flex flex-row mb-1">
                          <Image
                            source={require("@/assets/icons/amenities/yesTick.png")}
                            className="w-6 h-6 mr-2"
                            resizeMode="contain"
                          />
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Par email:{" "}
                            <Text className="text-neutrals-900 font-bold text-lg">
                              contact@uniresa.com
                            </Text>
                          </Text>
                        </View>
                        <View className="flex flex-row mb-1">
                          <Image
                            source={require("@/assets/icons/amenities/yesTick.png")}
                            className="w-6 h-6 mr-2"
                            resizeMode="contain"
                          />
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Par whatsApp:{" "}
                            <Text className="text-neutrals-900 font-bold text-lg">
                              lien whatsApp
                            </Text>
                          </Text>
                        </View>
                        <View className="flex flex-row mb-1">
                          <Image
                            source={require("@/assets/icons/amenities/yesTick.png")}
                            className="w-6 h-6 mr-2"
                            resizeMode="contain"
                          />
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Par Appel direct:{" "}
                            <Text className="text-neutrals-900 font-bold text-lg">
                              +237 670 86 41 08
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : selectedMethod === "paypal" ? (
                    <View>
                      <Text className="text-neutrals-800 text-justify text-base">
                        <Text className="font-bold">Important :{""}</Text>
                        Vous serez redirigé vers le site de PayPal pour
                        finaliser votre payment sécurisé
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          ) : parsedPaymentChannel === "onSpot" ? (
            <View className="m-4">
              <Text className="text-neutrals-900 text-lg font-bold ">
                Vous avez choisi de payer surplace à l'arrivée
              </Text>
              <Text className="text-neutrals-800 text-base">
                Vous avez un accompte de 5% soit{" "}
                <Text className="text-neutrals-900 text-lg font-bold">
                  {prepayment.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "XAF",
                  })}
                </Text>{" "}
                à regler dans les 3 prochains jours
              </Text>
              <Text className="text-neutrals-800 text-base font-semibold my-2">
                Le solde de {""}
                <Text className="text-neutrals-900 font-bold text-lg">
                  {downpayment.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "XAF",
                  })}
                </Text>{" "}
                est à regler surplace à votre arrivée
              </Text>
              <Text className="text-neutrals-800 text-base font-semibold my-2">
                Choisissez un moyen de paiement de l'accompte puis validez la
                reservation.
              </Text>
              <View className="border border-neutrals-100 my-4 rounded-lg">
                <Text className="text-neutrals-900 font-bold text-xl p-2">
                  Moyens de paiement
                </Text>
                <View className=" p-2 border-b border-b-neutrals-100">
                  <RadioButton
                    title="Portefeuille uniresa"
                    selected={selectedMethod === "portefeuille"}
                    onPress={() => setSelectedMethod("portefeuille")}
                  />
                  <RadioButton
                    title="Mobile Money"
                    selected={selectedMethod === "mobileMoney"}
                    onPress={() => setSelectedMethod("mobileMoney")}
                  />
                  <RadioButton
                    title="Transfert Bancaire"
                    selected={selectedMethod === "bankTransfer"}
                    onPress={() => setSelectedMethod("bankTransfer")}
                  />
                  <RadioButton
                    title="Paypal"
                    selected={selectedMethod === "paypal"}
                    onPress={() => setSelectedMethod("paypal")}
                  />
                </View>
                <View>
                  {selectedMethod === "portefeuille" ? (
                    <View className="m-4">
                      <Text className="text-neutrals-800 font-bold text-justify text-base my-4">
                        Solde de votre compte: {""}
                        <Text className="text-secondary-600 font-bold text-lg ">
                          {userBalance.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "XAF",
                          })}
                        </Text>
                      </Text>

                      {(user && userBalance > prepayment) ||
                      userBalance === prepayment ? (
                        <View className="p-2">
                          <View className="flex flex-row mb-1">
                            <Image
                              source={require("@/assets/icons/amenities/yesTick.png")}
                              className="w-6 h-6 mr-2"
                              resizeMode="contain"
                            />
                            <Text className="text-neutrals-800 shrink text-justify text-base">
                              Vous serrez debité de{" "}
                              <Text className="text-neutrals-900 font-bold text-lg">
                                {prepayment.toLocaleString("fr-FR", {
                                  style: "currency",
                                  currency: "XAF",
                                })}
                              </Text>{" "}
                              representant 5% d'accompte
                            </Text>
                          </View>
                          <View className="flex flex-row mb-1">
                            <Image
                              source={require("@/assets/icons/amenities/yesTick.png")}
                              className="w-6 h-6 mr-2"
                              resizeMode="contain"
                            />
                            <Text className="text-neutrals-800 shrink text-justify text-base">
                              Le solde de{" "}
                              <Text className="text-neutrals-900 font-bold text-lg">
                                {downpayment.toLocaleString("fr-FR", {
                                  style: "currency",
                                  currency: "XAF",
                                })}
                              </Text>{" "}
                              due au plutard le{" "}
                              {moment(freeCancellationExpiryDate).format(
                                "ddd DD MMM"
                              )}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View className="p-2">
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Votre solde est insuffisant veuillez recharger votre
                            compte ou utiliser un autre moyen de paiment.
                          </Text>

                          <View className="flex flex-row mb-1">
                            <Image
                              source={require("@/assets/icons/amenities/yesTick.png")}
                              className="w-6 h-6 mr-2"
                              resizeMode="contain"
                            />
                            <Text className="text-neutrals-800 shrink font-semibold  text-justify text-base">
                              Accompte: {""}
                              <Text className="text-neutrals-900 font-bold text-lg">
                                {prepayment.toLocaleString("fr-FR", {
                                  style: "currency",
                                  currency: "XAF",
                                })}
                              </Text>{" "}
                            </Text>
                          </View>
                          <View className="flex flex-row mb-1">
                            <Image
                              source={require("@/assets/icons/amenities/yesTick.png")}
                              className="w-6 h-6 mr-2"
                              resizeMode="contain"
                            />
                            <Text className="text-neutrals-800 font-semibold shrink text-justify text-base">
                              Solde:{" "}
                              <Text className="text-neutrals-900 font-bold text-lg">
                                {downpayment.toLocaleString("fr-FR", {
                                  style: "currency",
                                  currency: "XAF",
                                })}
                              </Text>{" "}
                              due au plutard le{" "}
                              {moment(freeCancellationExpiryDate).format(
                                "ddd DD MMM"
                              )}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  ) : selectedMethod === "mobileMoney" ? (
                    <View className="m-4">
                      <View className="flex flex-row mb-2 items-start">
                        <Image
                          source={require("@/assets/images/orangeMoney.png")}
                          className="w-16 h-12 mx-2"
                        />
                        <Image
                          source={require("@/assets/images/mtnMobileMoney.png")}
                          className="w-16 h-12 mx-2"
                        />
                      </View>
                      <Text className="text-neutrals-800 text-justify text-base mb-1">
                        Une fois votre reservation confirmee, Vous recevrez les
                        instructions pour le transfert OM ou MoMo sur votre
                        confirmation de reservation en page 2.
                      </Text>
                      <Text className="text-neutrals-800 font-semibold text-justify text-base mb-2">
                        Veuillez mentionner votre numéro de reservation lors de
                        l'envoie.
                      </Text>
                      <View className="mb-1">
                        <Text className="text-neutrals-800 shrink text-justify text-base">
                          N'hesitez pas de joindre notre service client en cas
                          de besoin:
                        </Text>
                        <View className="flex flex-row mb-1">
                          <Image
                            source={require("@/assets/icons/amenities/yesTick.png")}
                            className="w-6 h-6 mr-2"
                            resizeMode="contain"
                          />
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Par email:{" "}
                            <Text className="text-neutrals-900 font-bold text-lg">
                              contact@uniresa.com
                            </Text>
                          </Text>
                        </View>
                        <View className="flex flex-row mb-1">
                          <Image
                            source={require("@/assets/icons/amenities/yesTick.png")}
                            className="w-6 h-6 mr-2"
                            resizeMode="contain"
                          />
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Par whatsApp:{" "}
                            <Text className="text-neutrals-900 font-bold text-lg">
                              lien whatsApp
                            </Text>
                          </Text>
                        </View>
                        <View className="flex flex-row mb-1">
                          <Image
                            source={require("@/assets/icons/amenities/yesTick.png")}
                            className="w-6 h-6 mr-2"
                            resizeMode="contain"
                          />
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Par Appel direct:{" "}
                            <Text className="text-neutrals-900 font-bold text-lg">
                              +237 670 86 41 08
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : selectedMethod === "bankTransfer" ? (
                    <View className="m-4">
                      <Text className="text-neutrals-800 text-justify text-base mb-1">
                        Une fois votre reservation confirmee, Vous recevrez
                        notre RIB (Rélévé d'identité bancaire) avec toutes les
                        informations necessaires pour le paiement.
                      </Text>
                      <Text className="text-neutrals-800 font-semibold text-justify text-base mb-2">
                        Veuillez mentionner votre numéro de reservation comme
                        raison du virement
                      </Text>
                      <View className="mb-1">
                        <Text className="text-neutrals-800 shrink text-justify text-base">
                          N'hesitez pas de joindre notre service client en cas
                          de besoin:
                        </Text>
                        <View className="flex flex-row mb-1">
                          <Image
                            source={require("@/assets/icons/amenities/yesTick.png")}
                            className="w-6 h-6 mr-2"
                            resizeMode="contain"
                          />
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Par email:{" "}
                            <Text className="text-neutrals-900 font-bold text-lg">
                              contact@uniresa.com
                            </Text>
                          </Text>
                        </View>
                        <View className="flex flex-row mb-1">
                          <Image
                            source={require("@/assets/icons/amenities/yesTick.png")}
                            className="w-6 h-6 mr-2"
                            resizeMode="contain"
                          />
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Par whatsApp:{" "}
                            <Text className="text-neutrals-900 font-bold text-lg">
                              lien whatsApp
                            </Text>
                          </Text>
                        </View>
                        <View className="flex flex-row mb-1">
                          <Image
                            source={require("@/assets/icons/amenities/yesTick.png")}
                            className="w-6 h-6 mr-2"
                            resizeMode="contain"
                          />
                          <Text className="text-neutrals-800 shrink text-justify text-base">
                            Par Appel direct:{" "}
                            <Text className="text-neutrals-900 font-bold text-lg">
                              +237 670 86 41 08
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : selectedMethod === "paypal" ? (
                    <View>
                      <Text className="text-neutrals-800 text-justify text-base">
                        <Text className="font-bold">Important :{""}</Text>
                        Vous serez redirigé vers le site de PayPal pour
                        finaliser votre payment sécurisé
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          ) : null}
        </View>
        <View>
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
        </View>
      </ScrollView>
      {/* Fixed Footer */}
      <View className="p-4 border-t border-t-neutrals-60">
        <View className="mb-1">
          <Text className="text-xl text-neutrals-900 font-bold">
            {parsedTotalToPay.toLocaleString("fr-FR", {
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
          title="Confirmer"
          classNameTitle=""
          classNameLocal=""
          handlePress={handleBookingSubmit}
        />
      </View>
    </SafeAreaView>
  );
};

export default bookingConfirmation;
