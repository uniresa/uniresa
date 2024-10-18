import axios from "axios";
import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeResearchBar from "@/components/navigation/ThemeResearchBar";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import DiscountedList from "@/components/generalComponents/DiscountList";
import CityPropertiesList from "@/components/generalComponents/CityPropertiesList";
import {
  fetchAccommodationsStart,
  fetchAccommodationsSuccess,
  fetchAccommodationsError,
} from "@/redux/slices/accommodationSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import RecentSearch from "@/components/generalComponents/RecentSearch";
import {
  AccommodationProperty,
  SearchCriteria,
} from "@/typesDeclaration/types";
import { getUpcomingWeekend } from "@/utils/getUpcomingWeekend";
import PropertyCard from "@/components/generalComponents/PropertyCard";

const { checkInDate, checkOutDate } = getUpcomingWeekend();

const defaultSearchCriteria: SearchCriteria = {
  destination: {
    street: "",
    city: "Douala",
    district: "Wouri",
    region: "Région du Littoral",
    postalCode: "",
    country: "Cameroun",
    latitude: 4.0510564,
    longitude: 9.7678687,
  },
  dates: { checkInDate, checkOutDate },
  minGuests: 2,
  minRooms: 1,
};

const Home = () => {
  const backendApi: string | undefined = process.env.EXPO_PUBLIC_BASE_URL;
  const [defaultSearch, setDefaultSearch] = useState<AccommodationProperty[]>(
    []
  );
  const [topDiscountedHotels, setTopDiscountedHotels] = useState<
    AccommodationProperty[]
  >([]);
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userProfile);
  let userId: string;
  if (user) {
    userId = user.userId;
  }
  const recentSearch =
    useSelector((state: RootState) =>
      userId ? state.userSearchHistory[userId]?.recentSearch : null
    ) || defaultSearchCriteria;
  const searchedDestination = recentSearch.destination.city;

  useEffect(() => {
    const fetchDefaultSearch = async () => {
      if (!user && backendApi) {
        const query: SearchCriteria = defaultSearchCriteria;
        try {
          //fetch data based on user search history
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
          const results = await response.data?.data;
          if (!results || results.length === 0) {
            console.log("No results based on recent search");
          } else {
            setDefaultSearch(results);
          }
        } catch (error) {
          console.error("Error fetching recent search:", error);
          Alert.alert("Une erreur lors de la recharge des donnees");
        }
      }
    };
    fetchDefaultSearch();
  }, []);

  useEffect(() => {
    const listOfAccommodations = async () => {
      dispatch(fetchAccommodationsStart());
      if (!backendApi) {
        throw new Error("URL missing");
      }
      try {
        const response = await axios.get(
          `${backendApi}/api/accommodation/getAllAccommodations`,
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
            Destination {searchedDestination}
          </Text>
          {user ? (
            <RecentSearch userId={user.userId} />
          ) : (
            <FlatList
              data={defaultSearch}
              keyExtractor={(item) => item.propertyId}
              renderItem={({ item }) => (
                <PropertyCard
                  property={item}
                  containerStyle="flex flex-row h-72 w-96"
                  imageStyle="w-full h-full"
                  presentationStyle="w-3/4 p-2 ml-2"
                  imageContainerStyle="w-1/4 h-full"
                  reviewSize={12}
                  starSize={12}
                  amenityIconStyle="w-3 h-3 mr-1"
                  tripIconStyle="w-3 h-3"
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          )}
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
                Offres affichées: du {checkInDate} au {checkOutDate}
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
