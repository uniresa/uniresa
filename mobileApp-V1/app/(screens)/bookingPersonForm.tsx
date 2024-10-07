import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/generalComponents/CustomButton";
import { AccommodationProperty, BookingPerson } from "@/typesDeclaration/types";
import InputField from "@/components/generalComponents/InputField";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import CountryPickerWrapper from "@/utils/CountryPickerWrapper";

const bookingPersonForm = () => {
  const params = useLocalSearchParams();
  const {
    reservationTotalPrice,
    checkInDate,
    checkOutDate,
    selectedRooms,
    property,
  } = params;

  const [parsedProperty, setParsedProperty] =
    useState<AccommodationProperty | null>(null);
  const [parsedRooms, setParsedRooms] = useState<any[]>([]);
  const [bookingPerson, setBookingPerson] = useState<BookingPerson>({
    title: "",
    firstName: "",
    surName: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    address: {
      street: "",
      quartier: "",
      city: "",
      district: "",
      region: "",
      postalCode: "",
      country: "",
    },
  });
  const [selectedCountryCode, setSelectedCountryCode] =
    useState<CountryCode>("CM"); // Store the selected country name
  const [phonePrefix, setPhonePrefix] = useState<string>("+237"); // Store the country phone prefix

  useEffect(() => {
    try {
      if (property) {
        const propertyString = Array.isArray(property) ? property[0] : property;
        const parsedProp = JSON.parse(propertyString) as AccommodationProperty;
        setParsedProperty(parsedProp);
      }
      if (selectedRooms) {
        const selectedRoomsString = Array.isArray(selectedRooms)
          ? selectedRooms[0]
          : selectedRooms;
        const parsedSelectedRooms = JSON.parse(selectedRoomsString);
        setParsedRooms(parsedSelectedRooms);
      }
    } catch (error) {
      console.error("Error parsing params:", error);
    }
  }, [property, selectedRooms]);
  const handleCountrySelect = (country: any) => {
    setSelectedCountryCode(country.cca2 as CountryCode);
    setPhonePrefix(`+${country.callingCode[0]}`);
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
          Saisissez vos informations
        </Text>
      </View>
      {/* Booking Person Form */}
      <ScrollView>
        <View className="p-4">
          <InputField
            isRequired={true}
            label="Prenom"
            labelStyle="mb-1 font-bold text-xl"
          />
          <InputField
            isRequired={true}
            label="Nom"
            labelStyle="mb-1 font-bold text-xl"
          />
          <InputField
            isRequired={true}
            label="Email"
            labelStyle="mb-1 font-bold text-xl"
          />

          {/* Phone Number with Country Prefix */}
          <View>
            <View className="flex flex-row">
              <Text className="font-bold text-xl mb-1">Téléphone</Text>
              <Text className="text-accents text-xl"> *</Text>
            </View>
            <View className="flex flex-row items-center">
              <View className="bg-neutrals-20 border-4 border-neutrals-40 w-1/5 ">
                <TextInput
                  editable={false}
                  value={phonePrefix}
                  className="font-semibold text-neutrals-500 p-2 text-center text-lg"
                />
              </View>
              <InputField
                placeholder="Numéro de téléphone"
                keyboardType="phone-pad"
                className="w-4/5"
              />
            </View>
          </View>

          <InputField
            isRequired={true}
            label="Quartier de résidence"
            labelStyle="mb-1 font-bold text-xl"
          />
          <InputField
            isRequired={true}
            label="Ville"
            labelStyle="mb-1 font-bold text-xl"
          />
          {/* Country Picker */}
          <View className="flex flex-row">
            <Text className="font-bold text-xl mb-1">Pays</Text>
            <Text className="text-accents text-xl"> *</Text>
          </View>
          <View className="bg-neutrals-20 border-4 border-neutrals-40 rounded-2xl">
            <CountryPickerWrapper
              countryCode={selectedCountryCode}
              onSelect={handleCountrySelect}
              containerButtonStyle={{
                marginBottom: 8,
                backgroundColor: "#f7f7f7",
                padding: 4,
              }}
            />
          </View>
          <InputField
            label="Date de naissance"
            labelStyle="mb-1 font-bold text-xl"
          />
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
          title="Etape Suivante"
          classNameTitle=""
          classNameLocal=""
          handlePress={() => router.push("/(screens)/bookingRecap")}
        />
      </View>
    </SafeAreaView>
  );
};

export default bookingPersonForm;
