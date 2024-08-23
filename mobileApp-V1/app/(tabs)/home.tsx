import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeResearchBar from "@/components/navigation/ThemeResearchBar";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import RecentSearch from "@/components/generalComponents/RecentSearch";
import DiscountedList from "@/components/generalComponents/DiscountList";

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
        <View className="p-4 ">
          <Text className="text-xl font-lbold">
            Hebergements recomandés pour vous
          </Text>
          <Text className="text-base mt-2">
            Destination {defaultSearchCriteria.place}
          </Text>
          <RecentSearch searchCriteria={defaultSearchCriteria} />
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
            <View className="absolute bottom-4 p-4">
              <Text className="text-neutrals text-2xl font-lbold">
                Offres de derniere minute pour le week-end
              </Text>
              <Text className="text-neutrals text-lg font-lbold m-2">
                <Text className="text-neutrals text-lg font-lbold m-2">
                  Offres affichées: du {fridayFormatted} au {sundayFormatted}
                </Text>
              </Text>
              <DiscountedList />
            </View>
          </ImageBackground>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default Home;
