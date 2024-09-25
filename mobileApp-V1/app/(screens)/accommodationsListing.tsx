import axios, { AxiosError } from "axios";
import { View, Text, Image, Modal } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Href, router, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/generalComponents/CustomButton";
import GuestPickerModal from "@/components/generalComponents/GuestPickerModal";
import {
  Guests,
  BookingDates,
  SearchCriteria,
  LocationDetails,
} from "@/typesDeclaration/types";
import DatePickerModal from "@/components/generalComponents/DatePickerModal";
import moment from "moment";
import "moment/locale/fr";
import {
  fetchSearchResultsError,
  fetchSearchResultsStart,
  fetchSearchResultsSuccess,
  searchResults,
} from "@/redux/slices/searchResultSlice";
import {
  setSearchCriteria,
  updateDestination,
  updateDates,
  updateGuests,
  updateRooms,
  selectSearchCriteria,
} from "@/redux/slices/searchCriteriaSlice";
import { useDispatch, useSelector } from "react-redux";

const accommodationsListing = () => {
  const backendApi = process.env.EXPO_PUBLIC_BASE_URL;
  moment.locale("fr");
  const { loading, error, accommodations } = useSelector(searchResults);
  const searchCriteria = useSelector(selectSearchCriteria);
  const { destination, dates, guests, rooms } = searchCriteria;
  const [guestDestination, setGuestDestination] = useState<LocationDetails>({
    street: "",
    quartier: "",
    city: "",
    district: "",
    region: "",
    postalCode: "",
    country: "",
    latitude: 0,
    longitude: 0,
  });
  const [localDestination, setLocalDestination] = useState<string>();
  const [localGuests, setLocalGuests] = useState<Guests>({
    adults: 2,
    children: 0,
  });
  const [localRooms, setLocalRooms] = useState(1);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState<BookingDates>({
    checkInDate: "",
    checkOutDate: "",
  });
  const dispatch = useDispatch();
  const params = useLocalSearchParams();

  // Set the guest destination if received from the destinationPicker screen
  useEffect(() => {
    if (params.selectedDestination) {
      const parsedDestination = JSON.parse(
        params.selectedDestination as string
      );
      setGuestDestination(parsedDestination as LocationDetails);

      if (params.destinationPicked) {
        setLocalDestination(params.destinationPicked as string);
        dispatch(
          setSearchCriteria({ destination: params.destinationPicked as string })
        );
        dispatch(updateDestination(params.destinationPicked as string));
      }
    }
  }, [params.selectedDestination]);

  const handleDatePickerConfirm = (newBookingDates: BookingDates) => {
    const checkInDate = moment(
      newBookingDates.checkInDate,
      ["MM/DD/YYYY", "YYYY-MM-DD"],
      true
    );
    const checkOutDate = moment(
      newBookingDates.checkOutDate,
      ["MM/DD/YYYY", "YYYY-MM-DD"],
      true
    );

    if (checkInDate.isValid() && checkOutDate.isValid()) {
      setSelectedRange({
        checkInDate: checkInDate.format("YYYY-MM-DD"), // Store as ISO-compliant date
        checkOutDate: checkOutDate.format("YYYY-MM-DD"),
      });
      dispatch(
        updateDates({
          checkInDate: checkInDate.format("YYYY-MM-DD"), // Store as ISO-compliant date
          checkOutDate: checkOutDate.format("YYYY-MM-DD"),
        })
      );
    } else {
      console.error("Invalid date provided:", newBookingDates);
    }

    setShowDatePicker(false);
  };
  const handleGuestPickerConfirm = (newGuests: Guests, newRooms: number) => {
    setLocalGuests(newGuests);
    setLocalRooms(newRooms);
    dispatch(updateGuests(localGuests));
    dispatch(updateRooms(localRooms));
    setShowGuestsPicker(false);
  };

  const handleSearch = async () => {
    dispatch(fetchSearchResultsStart());
    if (!backendApi) {
      throw new Error("URL missing");
    }
    try {
      const query: SearchCriteria = {
        destination: guestDestination,
        dates: {
          checkInDate: dates.checkInDate,
          checkOutDate: dates.checkOutDate,
        },

        minGuests: guests.adults + guests.children,

        minRooms: rooms,
      };
      const response = await axios.post(
        `${backendApi}/api/accommodation/getSearchedAccomodations`,
        query,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const results = await response.data.data;
      if (!results || results.length === 0) {
        throw new Error(
          "Aucun résultat trouvé pour ces critères de recherche."
        );
        return;
      }
      dispatch(fetchSearchResultsSuccess(results));
      router.push("/searchResults" as Href<"/searchResults">);
    } catch (error) {
      // Type-check if error is an AxiosError
      if (error instanceof AxiosError) {
        // Dispatch only the serializable parts of the Axios error (message)
        dispatch(fetchSearchResultsError({ message: error.message }));
      } else {
        // Handle generic errors (non-Axios errors)
        dispatch(
          fetchSearchResultsError({ message: "An unexpected error occurred" })
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutrals-20">
      <ScrollView>
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className="mx-4 my-2"
        >
          <Image
            source={require("@/assets/icons/backArrowActive.png")}
            className=" w-8 h-8"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View className="flex flex-col items-center justify-between mt-4 px-4">
          <Text className="text-2xl text-neutrals-900 font-lbold mb-8 ">
            Saisissez vos criteres de recherche
          </Text>

          <View className="w-full mt-2 border-2 border-neutrals-60 rounded-3xl">
            {/* Destination Picker (Opens Modal) */}
            <TouchableOpacity
              onPress={() =>
                router.push("/destinationPicker" as Href<"/destinationPicker">)
              }
              className=" rounded-2xl"
            >
              <View className="flex flex-row border-b-2 border-neutrals-60 my-3 p-2 items-center justify-start">
                <Image
                  source={require("@/assets/icons/mapLocation.png")}
                  className="w-6 h-8 mr-6"
                />
                <Text className="text-neutrals-800 font-semibold text-lg">
                  {localDestination ? `${localDestination}` : "Destination"}
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
                    {localGuests.adults > 1
                      ? `${localGuests.adults} Adultes, `
                      : `${localGuests.adults} Adulte, `}
                  </Text>
                  <Text>
                    {localGuests.children > 1
                      ? `${localGuests.children} Enfants, `
                      : `${localGuests.children} Enfant, `}
                  </Text>
                  <Text>
                    {localRooms > 1
                      ? `${localRooms} chambres`
                      : `${localRooms} chambre`}
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

          {/* Date Picker Modal (Calendar for selecting date range) */}
          <DatePickerModal
            isVisible={showDatePicker}
            bookingDates={dates}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default accommodationsListing;
