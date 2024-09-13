import axios from "axios";
import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeResearchBar from "@/components/navigation/ThemeResearchBar";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import RecentSearch from "@/components/generalComponents/RecentSearch";
import DiscountedList from "@/components/generalComponents/DiscountList";
import CityPropertiesList from "@/components/generalComponents/CityPropertiesList";
import {
  fetchAccommodationsStart,
  fetchAccommodationsSuccess,
  fetchAccommodationsError,
  accommodationsList,
} from "@/redux/slices/accommodationSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const defaultSearchCriteria: {
  place: string;
  minRating: number;
  maxPrice: number;
} = {
  place: "Yaounde",
  minRating: 2,
  maxPrice: 150000,
};

const getUpcomingWeekendDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Get the current day of the week (0-6, where 0 is Sunday)

  const daysUntilFriday = 5 - dayOfWeek;
  const daysUntilSunday = 7 - dayOfWeek;

  const friday = new Date(today);
  friday.setDate(today.getDate() + daysUntilFriday);

  const sunday = new Date(today);
  sunday.setDate(today.getDate() + daysUntilSunday);

  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
  const fridayFormatted = friday.toLocaleDateString("fr-FR", options);
  const sundayFormatted = sunday.toLocaleDateString("fr-FR", options);

  return { fridayFormatted, sundayFormatted };
};

// Function to calculate the upcoming weekend dates
const { fridayFormatted, sundayFormatted } = getUpcomingWeekendDates();

const Home = () => {
  const dispatch = useDispatch();
  const { accommodations, loading, error } = useSelector(
    (state: RootState) => state.accommodationsList
  );
  const { user } = useSelector((state: RootState) => state.userProfile);
  const listOfAccommodations = async () => {
    dispatch(fetchAccommodationsStart());
    try {
      const response = await axios.get(
        "http://192.168.1.181:8080/api/userProfile/create",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const accommodationsData = response.data;
      if (accommodationsData.status === "success") {
        dispatch(fetchAccommodationsSuccess(accommodationsData.data));
        console.log(accommodationsData);
      } else {
        // Handle the case where the status is not 'success'
        dispatch(fetchAccommodationsError("Failed to fetch accommodations"));
        console.error(
          "Failed to fetch accommodations:",
          accommodationsData.message
        );
      }
    } catch (error: any) {
      dispatch(fetchAccommodationsError(error.message));
      console.log("Error fetching accommodations:", error.message);
    }
  };
  useEffect(() => {
    listOfAccommodations();
  }, []);
  return (
    <SafeAreaView>
      <ParallaxScrollView
        headerBackgroundColor="bg-primary"
        notificationIcon={
          <Image
            source={require("@/assets/icons/notificationOnBg.png")}
            className="absolute bottom-4 right-4 w-8 h-8"
            resizeMode="contain"
          />
        }
        headerImage={
          <Image
            source={require("@/assets/images/logoblanc24.png")}
            className=" w-18 h-10"
            resizeMode="contain"
          />
        }
      >
        <ThemeResearchBar />
        <View className="m-4  ">
          <Text className="text-xl font-lbold m-4 ">
            Hebergements recomandés pour vous
          </Text>
          <Text className="text-base mx-4">
            Destination {defaultSearchCriteria.place}
          </Text>
          {user ? <RecentSearch userId={user.userId} /> : ""}
        </View>
        <View className="p-4">
          <ImageBackground
            source={require("@/assets/images/bgImages/douala.jpg")}
            className="h-[650px] rounded-xl overflow-hidden"
            imageStyle={{ borderRadius: 15 }}
          >
            {/* Overlay with Opacity */}

            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(51, 51, 51, 0.7)",
                borderRadius: 15,
              }}
            />
            <View className="absolute bottom-0 mx-4">
              <Text className="text-neutrals text-xl font-lbold">
                Offres de derniere minute pour le week-end
              </Text>
              <Text className="text-neutrals text-sm font-lbold m-2">
                Offres affichées: du {fridayFormatted} au {sundayFormatted}
              </Text>
              <DiscountedList />
            </View>
          </ImageBackground>
        </View>
        <View className="m-4">
          <Text className="text-xl font-rbold text-neutrals-900 m-4">
            Decouvrez les hebergements dans les destinations populaires
          </Text>
          <CityPropertiesList />
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default Home;
