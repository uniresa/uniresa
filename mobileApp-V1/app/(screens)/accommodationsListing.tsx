import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import { TouchableOpacity } from "react-native-gesture-handler";
import InputField from "@/components/generalComponents/InputField";
import { router } from "expo-router";
import CustomButton from "@/components/generalComponents/CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import GuestPickerModal from "@/components/generalComponents/GuestPickerModal";
import { Guests } from "@/typesDeclaration/types";

const accommodationsListing = () => {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState({
    checkIn: new Date(),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
  });
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [rooms, setRooms] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAccommodations, setSelectedAccommodations] = useState([]);
  //   const handleDateChange = (event, selectedDate, field) => {
  //     const currentDate = selectedDate || dates[field];
  //     setDates({ ...dates, [field]: currentDate });
  //   };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const query = {
        destination,
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        adults: guests.adults,
        children: guests.children,
      };

      // Assume fetchAccommodations is an API call that fetches search results
      //   const results = await fetchAccommodations(query);
      //   setSelectedAccommodations(results);
    } catch (err) {
      //   setError("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const handleGuestPickerConfirm = (newGuests: Guests, newRooms: number) => {
    setGuests(newGuests);
    setRooms(newRooms);
    setShowGuestsPicker(false);
  };
  //   const [selectedDate, setSelectedDate] = useState(new Date());
  //   const handleSearch = () => {
  //     setLoading(true);
  //     // Add search functionality here
  //     setTimeout(() => setLoading(false), 1500); // Mock loading
  //   };
  //   const handleDateChange = (event: any, date?: Date) => {
  //     setShowDatePicker(false);
  //     if (date) {
  //       setSelectedDate(date);
  //       setForm({ ...form, dates: date.toLocaleDateString() });
  //     }
  //   };
  //   type GuestType = "adults" | "children";
  //   const updateGuests = (type: GuestType, action: "increment" | "decrement") => {
  //     setForm((prevState) => {
  //       let newValue = prevState[type];
  //       newValue =
  //         action === "increment" ? newValue + 1 : Math.max(0, newValue - 1);

  //       return { ...prevState, [type]: newValue };
  //     });
  //   };
  return (
    <SafeAreaView className="flex-1 bg-neutrals-20">
      <ParallaxScrollView
        headerBackgroundColor="bg-primary"
        closingButton={
          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="absolute bottom-6 left-0"
          >
            <Image
              source={require("@/assets/icons/backArrow.png")}
              className=" w-6 h-6"
              resizeMode="contain"
            />
            {/* <Text className="text-neutrals-800 text-3xl font-lbold">X</Text> */}
          </TouchableOpacity>
        }
        headerImage={
          <Image
            source={require("@/assets/images/logoblanc24.png")}
            className=" w-18 h-10"
            resizeMode="contain"
          />
        }
      >
        <View className="flex flex-col items-center justify-between mt-4 px-4">
          <Text className="text-2xl text-neutrals-900 font-lbold mb-8 ">
            Saisissez vos criteres de recherche
          </Text>

          <View className="w-full mt-4">
            {/* Guests Selector (Opens Modal) */}
            <TouchableOpacity onPress={() => setShowGuestsPicker(true)}>
              <View className="flex flex-row p-2 border-2 border-neutrals-60 mb-3 items-center">
                <Image
                  source={require("@/assets/icons/personWithKid.png")}
                  className="w-6 h-6 mr-6"
                />
                <Text className="text-neutrals-800 font-semibold text-lg">
                  <Text>
                    {guests.adults > 1
                      ? `${guests.adults} Adultes, `
                      : `${guests.adults} Adulte, `}
                  </Text>
                  <Text>
                    {guests.children > 1
                      ? `${guests.children} Enfants, `
                      : `${guests.children} Enfant, `}
                  </Text>
                  <Text>
                    {rooms > 1 ? `${rooms} chambres` : `${rooms} chambre`}
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>

            <CustomButton
              title={loading ? "En cours..." : "Rechercher"}
              handlePress={handleSearch}
              className="mt-6"
            />
          </View>
          {/* Guest Picker Modal */}
          <GuestPickerModal
            isVisible={showGuestsPicker}
            numberOfRooms={rooms}
            guests={guests}
            onClose={() => setShowGuestsPicker(false)}
            onConfirm={handleGuestPickerConfirm}
          />
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default accommodationsListing;

{
  /* Destination Input */
}
//   <InputField
//   icon={require("@/assets/icons/mapLocation.png")}
//   placeholder="Saisir une destination"
//   value={destination}
//   onChangeText={(value) => setDestination(value)}
//   containerStyle="mb-4 p-2"
// />
// {/* Date Picker */}
// <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//   <InputField
//     placeholder="Choisir vos dates"
//     // textContentType= "Date"
//     value={dates}
//     icon={require("@/assets/icons/calander.png")}
//     editable={false}
//     //   onChangeText={(value) => setForm({ ...form, dates: value })}
//     containerStyle="mb-4 p-2"
//   />
// </TouchableOpacity>
// {showDatePicker && (
//   <DateTimePicker
//     value={selectedDate}
//     mode="date"
//     display="default"
//     onChange={handleDateChange}
//   />
// )}
