import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import { TouchableOpacity } from "react-native-gesture-handler";
import InputField from "@/components/generalComponents/InputField";
import { router } from "expo-router";
import CustomButton from "@/components/generalComponents/CustomButton";
import GuestPickerModal from "@/components/generalComponents/GuestPickerModal";
import { Guests, BookingDates } from "@/typesDeclaration/types";
import DatePickerModal from "@/components/generalComponents/DatePickerModal";
import moment from "moment";
import "moment/locale/fr";

const accommodationsListing = () => {
  moment.locale("fr");
  const [guests, setGuests] = useState<Guests>({ adults: 2, children: 0 });
  const [rooms, setRooms] = useState(1);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calendar states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState<BookingDates>({
    checkInDate: "",
    checkOutDate: "",
  });
  const handleDatePickerConfirm = (newBookingDates: BookingDates) => {
    setSelectedRange(newBookingDates);
    setShowDatePicker(false);
  };

  const [destination, setDestination] = useState("");
  const [selectedAccommodations, setSelectedAccommodations] = useState([]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const query = {
        destination,
        // checkIn: dates.checkIn,
        // checkOut: dates.checkOut,
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

  const handleGuestPickerConfirm = (newGuests: Guests, newRooms: number) => {
    setGuests(newGuests);
    setRooms(newRooms);
    setShowGuestsPicker(false);
  };

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
            {/* Date Picker (Opens Modal) */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View className="flex flex-row p-2 border-2 border-neutrals-60 mb-3 items-center">
                <Image
                  source={require("@/assets/icons/calander.png")}
                  className="w-6 h-6 mr-6"
                />
                <Text className="text-neutrals-800 font-semibold text-lg">
                  {selectedRange.checkInDate && selectedRange.checkOutDate
                    ? `Du ${moment(selectedRange.checkInDate).format(
                        "ddd DD MMM"
                      )} -Au ${moment(selectedRange.checkOutDate).format(
                        "ddd DD MMM"
                      )}`
                    : "choisissez vos dates de voyage"}
                </Text>
              </View>
            </TouchableOpacity>

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
          {/* Date Picker Modal (Calendar for selecting date range) */}
          <DatePickerModal
            isVisible={showDatePicker}
            bookingDates={selectedRange}
            onClose={() => setShowDatePicker(false)}
            onConfirm={handleDatePickerConfirm}
          />

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
{
  /* <DateTimePicker
  value={selectedDate}
  mode="date"
  display="default"
  onChange={handleDateChange}
/>; */
}
// )}
