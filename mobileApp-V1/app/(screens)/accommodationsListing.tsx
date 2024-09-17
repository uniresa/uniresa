import { View, Text, Image, Modal } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import CustomButton from "@/components/generalComponents/CustomButton";
import GuestPickerModal from "@/components/generalComponents/GuestPickerModal";
import { Guests, BookingDates } from "@/typesDeclaration/types";
import DatePickerModal from "@/components/generalComponents/DatePickerModal";
import moment from "moment";
import "moment/locale/fr";
import DestinationPickerModal from "@/components/generalComponents/DestinationPickerModal";

const accommodationsListing = () => {
  moment.locale("fr");
  const [guestDestination, setGuestDestination] = useState<string>("");
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);
  const [guests, setGuests] = useState<Guests>({ adults: 2, children: 0 });
  const [rooms, setRooms] = useState(1);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState<BookingDates>({
    checkInDate: "",
    checkOutDate: "",
  });
  const handleDatePickerConfirm = (newBookingDates: BookingDates) => {
    setSelectedRange(newBookingDates);
    setShowDatePicker(false);
  };


  const handleDestinationPickerConfirm = (newDestination: string) => {
    setGuestDestination(newDestination);
    setShowDestinationPicker(false);
  };

  const [selectedAccommodations, setSelectedAccommodations] = useState([]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const query = {
        guestDestination,
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

          <View className="w-full mt-4 border-2 border-neutrals-60 rounded-3xl">
            {/* Destination Picker (Opens Modal) */}
            <TouchableOpacity
              onPress={() => setShowDestinationPicker(true)}
              className=" rounded-2xl"
            >
              <View className="flex flex-row border-b-2 border-neutrals-60 my-3 p-2 items-center justify-start">
                <Image
                  source={require("@/assets/icons/mapLocation.png")}
                  className="w-6 h-8 mr-6"
                />
                <Text className="text-neutrals-800 font-semibold text-lg">
                  {guestDestination ? `${guestDestination}` : "Destination"}
                </Text>
              </View>
            </TouchableOpacity>
            {/* Date Picker (Opens Modal) */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View className="flex flex-row border-b-2 border-neutrals-60 my-3 p-2 items-center justify-start">
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
              <View className="flex flex-row border-b-2 border-neutrals-60 my-3 p-2 items-center justify-start">
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
            <View className="mt-12 mb-3 mx-6">
              <CustomButton
                title={loading ? "En cours..." : "Rechercher"}
                handlePress={handleSearch}
              />
            </View>
          </View>
          {/* Destination Picker Modal (Calendar for selecting date range) */}
          <DestinationPickerModal
            isVisible={showDestinationPicker}
            searchDestination={guestDestination}
            onClose={() => setShowDestinationPicker(false)}
            onConfirm={handleDestinationPickerConfirm}
          />

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
  /* <Modal
            visible={showDestinationPicker}
            animationType="slide"
            onRequestClose={() => setShowDestinationPicker(false)}
          >
            <GooglePlacesAutocomplete
              keyboardShouldPersistTaps="handled"
              placeholder="Saisissez la destination"
              fetchDetails={true}
              debounce={200}
              styles={{
                container: {
                  flex: 1,
                  //   position: "absolute", // Make sure the suggestions container is absolute
                  //   top: 0, // Adjust position as needed
                  //   left: 0,
                  //   right: 0,
                  //   zIndex: 1000,
                },
                listView: {
                  backgroundColor: "white",
                  zIndex: 1000, // Ensure dropdown stays above other elements
                },
                textInputContainer: {
                  flexDirection: "row",
                },
                textInput: {
                  height: 38,
                  color: "#5d5d5d",
                  fontSize: 16,
                },
                predefinedPlacesDescription: {
                  color: "#1faadb",
                },
              }}
              onPress={(data, details = null) => {
                console.log("Selected data:", data);
                if (details) {
                  console.log("Selected details:", details);
                } else {
                  console.log("No details fetched.");
                }

                if (data && data.description) {
                  setGuestDestination(data.description);
                  setShowDestinationPicker(false); // Close the modal
                } else {
                  console.error("No destination selected");
                }
              }}
              query={{
                key: "AIzaSyBgcgKoZOsYOSeLW2SZXCXAIhI_rznUyDM",
                language: "fr", // Language for search results
              }}
              renderLeftButton={() => (
                <View className="justify-center items-center w-6 h-6">
                  <Image
                    source={require("@/assets/icons/searchIcon.png")}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                </View>
              )}
            />
          </Modal> */
}
