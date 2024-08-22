import { View, Text, FlatList, Image, ImageBackground } from "react-native";
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

        <View className=" h-[650px] w-[350px] rounded-xl p-4">
          <ImageBackground
            source={require("@/assets/images/bgImages/cameroun1.jpg")}
            className="h-full rounded-xl  "
          >
            <View>
              <Text className="text-neutrals text-2xl font-lbold">
                Offres de derniere minute pour le week-end
              </Text>
              <Text className="text-base mt-2">
                Destination {defaultSearchCriteria.place}
              </Text>
            </View>
            <View className="absolute bottom-6">
              <DiscountedList />
            </View>
          </ImageBackground>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default Home;
