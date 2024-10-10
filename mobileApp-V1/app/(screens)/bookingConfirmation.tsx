import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/generalComponents/CustomButton";
import RadioButton from "@/components/generalComponents/RadioButton";
import { useSelector } from "react-redux";
import { loggedInUser } from "@/redux/slices/userSlice";

const bookingConfirmation = () => {
  const { user } = useSelector(loggedInUser);
  const [selectedMethod, setSelectedMethod] = useState("portefeuille");
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
    paymentChannel,
  } = params;
  const parsedPaymentChannel = Array.isArray(paymentChannel)
    ? paymentChannel[0]
    : paymentChannel;
  const parsedCheckingDate = new Date(
    Array.isArray(checkInDate) ? checkInDate[0] : checkInDate
  );
  const freeCancellationExpiryDate = new Date(parsedCheckingDate);
  freeCancellationExpiryDate.setDate(parsedCheckingDate.getDate() - 2);
  const prepayment = (parsedTotalToPay * 5) / 100;
  const downpayment = (parsedTotalToPay * 95) / 100;
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
  const handleBookingSubmit = () => {};
  console.log(user);
  console.log(user?.accountBalance);
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
        {parsedPaymentChannel === "uniresa" ? (
          <View>
            <Text>Vous avez choisi de payer votre reservation surplace</Text>
            <Text>
              Vous avez un accompte de 5% soit{" "}
              <Text>
                {prepayment.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "XAF",
                })}
              </Text>{" "}
              à regler dans les 3 prochains jours
            </Text>
            <Text>
              Une fois la reservation validée, Nous vous enverrons une
              confirmation de reservation avec les details suivant les methodes
              de paiement qui s'offrent à vous:
            </Text>
            <View className="border border-neutrals-100 m-4 rounded-lg">
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
                      {user ? (
                        <Text className="text-secondary-600 font-bold text-lg ">
                          {user.accountBalance.amount.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "XAF",
                          })}
                        </Text>
                      ) : null}
                    </Text>
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
                          sera à payer directement surplace à votre arrivée
                        </Text>
                      </View>
                    </View>
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
                        N'hesitez pas de joindre notre service client en cas de
                        besoin:
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
                      Une fois votre reservation confirmee, Vous recevrez notre
                      RIB (Rélévé d'identité bancaire) avec toutes les
                      informations necessaires pour le paiement.
                    </Text>
                    <Text className="text-neutrals-800 font-semibold text-justify text-base mb-2">
                      Veuillez mentionner votre numéro de reservation comme
                      raison du virement
                    </Text>
                    <View className="mb-1">
                      <Text className="text-neutrals-800 shrink text-justify text-base">
                        N'hesitez pas de joindre notre service client en cas de
                        besoin:
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
                      Vous serez redirigé vers le site de PayPal pour finaliser
                      votre payment sécurisé
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ) : parsedPaymentChannel === "onSpot" ? (
          <View>
            <Text>Vous avez choisi de payer votre reservation surplace</Text>
            <Text>
              Vous avez un accompte de 5% soit{" "}
              <Text>
                {prepayment.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "XAF",
                })}
              </Text>{" "}
              à regler dans les 3 prochains jours
            </Text>
            <Text>
              Une fois la reservation validée, Nous vous enverrons une
              confirmation de reservation avec les details suivant les methodes
              de paiement qui s'offrent à vous:
            </Text>
            <View className="border border-neutrals-100 m-4 rounded-lg">
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
                      {user ? (
                        <Text className="text-secondary-600 font-bold text-lg ">
                          {user.accountBalance.amount.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "XAF",
                          })}
                        </Text>
                      ) : null}
                    </Text>
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
                          sera à payer directement surplace à votre arrivée
                        </Text>
                      </View>
                    </View>
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
                        N'hesitez pas de joindre notre service client en cas de
                        besoin:
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
                      Une fois votre reservation confirmee, Vous recevrez notre
                      RIB (Rélévé d'identité bancaire) avec toutes les
                      informations necessaires pour le paiement.
                    </Text>
                    <Text className="text-neutrals-800 font-semibold text-justify text-base mb-2">
                      Veuillez mentionner votre numéro de reservation comme
                      raison du virement
                    </Text>
                    <View className="mb-1">
                      <Text className="text-neutrals-800 shrink text-justify text-base">
                        N'hesitez pas de joindre notre service client en cas de
                        besoin:
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
                      Vous serez redirigé vers le site de PayPal pour finaliser
                      votre payment sécurisé
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ) : null}
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
