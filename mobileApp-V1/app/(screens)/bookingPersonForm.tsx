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
import { useSelector } from "react-redux";
import { loggedInUser } from "@/redux/slices/userSlice";

const titleOptions = [
  { label: "Mr", value: "Monsieur" },
  { label: "Mme", value: "Madame" },
  { label: "Mlle", value: "Mademoiselle" },
  { label: "Dr", value: "Docteur" },
  { label: "Pr", value: "Professeur" },
  { label: "Ing", value: "Ingenieur" },
  { label: "Me", value: "Maitre" },
];

const bookingPersonForm = () => {
  const { user } = useSelector(loggedInUser);
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
    accountBalance: { amount: 0, currency: "FCFA" },
    address: {
      street: "",
      city: "",
      district: "",
      region: "",
      postalCode: "",
      country: "Cameroun",
    },
  });
  const [selectedCountryCode, setSelectedCountryCode] =
    useState<CountryCode>("CM"); // Store the selected country name
  const [phonePrefix, setPhonePrefix] = useState<string>("+237"); // Store the country phone prefix
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    // Autofill bookingPerson data if user is logged in
    if (user) {
      setBookingPerson((prevState) => ({
        ...prevState,
        title: user.title || "", // Assuming user object has a title property
        firstName: user.firstName || "",
        surName: user.surName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        birthDate: user.birthDate || "",
        address: {
          ...prevState.address,
          street: user.address?.street || "",
          city: user.address?.city || "",
          country: user.address?.country || "Cameroun", // Default country if not provided
        },
      }));
    }
  }, [user]);

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
    setBookingPerson((prevState) => ({
      ...prevState,
      address: {
        ...prevState.address,
        country: country.name,
      },
    }));
  };
  // Update the title in bookingPerson whenever it changes
  useEffect(() => {
    setBookingPerson((prevState) => ({
      ...prevState,
      title: selectedTitle,
    }));
  }, [selectedTitle]);
  const moveToBookingRecap = () => {
    if (
      bookingPerson.title === "" ||
      bookingPerson.firstName === "" ||
      bookingPerson.surName === "" ||
      bookingPerson.email === "" ||
      bookingPerson.phoneNumber === "" ||
      bookingPerson.address.street === "" ||
      bookingPerson.address.city === "" ||
      bookingPerson.address.country === ""
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    router.push({
      pathname: "/(screens)/bookingRecap",
      params: {
        reservationTotalPrice,
        checkInDate,
        checkOutDate,
        selectedRooms,
        property,
        bookingPerson: JSON.stringify(bookingPerson),
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
          <View className="mb-4">
            <Text className="font-bold text-xl mb-1">Titre *</Text>
            <TouchableOpacity
              onPress={() => setIsDropdownOpen((prev) => !prev)}
              className="bg-neutrals-20 border-4 border-neutrals-40 rounded-2xl p-2 w-1/4"
            >
              <Text className="text-lg">
                {selectedTitle ? (
                  selectedTitle
                ) : (
                  <Image source={require("@/assets/icons/arrowDown.png")} />
                )}
              </Text>
            </TouchableOpacity>
            {isDropdownOpen && (
              <View className="absolute z-20 bg-neutrals-60 border border-neutrals-100 rounded shadow-md mt-4">
                {titleOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      setSelectedTitle(option.label);
                      setIsDropdownOpen(false);
                    }}
                    className="p-2 hover:bg-gray-200"
                  >
                    <Text>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <InputField
            isRequired={true}
            label="Prenom"
            labelStyle="mb-1 font-bold text-xl"
            textContentType="name"
            value={bookingPerson.firstName}
            onChangeText={(value) =>
              setBookingPerson({ ...bookingPerson, firstName: value })
            }
          />
          <InputField
            isRequired={true}
            label="Nom"
            labelStyle="mb-1 font-bold text-xl"
            textContentType="familyName"
            value={bookingPerson.surName}
            onChangeText={(value) =>
              setBookingPerson({ ...bookingPerson, surName: value })
            }
          />
          <InputField
            isRequired={true}
            label="Email"
            labelStyle="mb-1 font-bold text-xl"
            textContentType="emailAddress"
            value={bookingPerson.email}
            onChangeText={(value) =>
              setBookingPerson({ ...bookingPerson, email: value })
            }
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
                textContentType="telephoneNumber"
                value={bookingPerson.phoneNumber.replace(phonePrefix, "")}
                onChangeText={(value) =>
                  setBookingPerson({
                    ...bookingPerson,
                    phoneNumber: `${phonePrefix}${value}`,
                  })
                }
              />
            </View>
          </View>

          <InputField
            isRequired={true}
            label="Rue ou Quartier"
            labelStyle="mb-1 font-bold text-xl"
            textContentType="addressCity"
            value={bookingPerson.address.street}
            onChangeText={(value) =>
              setBookingPerson((prevState) => ({
                ...prevState,
                address: {
                  ...prevState.address,
                  street: value,
                },
              }))
            }
          />
          <InputField
            isRequired={true}
            label="Ville"
            labelStyle="mb-1 font-bold text-xl"
            textContentType="addressCity"
            value={bookingPerson.address.city}
            onChangeText={(value) =>
              setBookingPerson((prevState) => ({
                ...prevState,
                address: {
                  ...prevState.address,
                  city: value,
                },
              }))
            }
          />
          {/* Country Picker */}
          <View className="flex flex-row">
            <Text className="font-bold text-xl mb-1">Pays</Text>
            <Text className="text-accents text-xl"> *</Text>
          </View>
          <View className=" bg-neutrals-20 border-4 border-neutrals-40 rounded-2xl">
            <CountryPickerWrapper
              countryCode={selectedCountryCode}
              onSelect={handleCountrySelect}
              containerButtonStyle={{
                marginBottom: 8,
                backgroundColor: "#f7f7f7",
                padding: 4,
                justifyContent: "space-between",
              }}
            />
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
          title="Etape Suivante"
          classNameTitle=""
          classNameLocal=""
          handlePress={moveToBookingRecap}
        />
      </View>
    </SafeAreaView>
  );
};

export default bookingPersonForm;
