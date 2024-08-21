import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeResearchBar from "@/components/navigation/ThemeResearchBar";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import RecentSearch from "@/components/generalComponents/RecentSearch";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];
const defaultSearchCriteria: {
  place: string;
  minRating: number;
  maxPrice: number;
} = {
  place: "Yaounde",
  minRating: 2,
  maxPrice: 150000,
};

type ItemProps = { title: string };

const Item = ({ title }: ItemProps) => (
  <View>
    <Text>{title}</Text>
  </View>
);
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
          <Text className="text-xl font-lbold">Hebergements recomandés pour vous</Text>
          <Text className="text-base mt-2">
            Destination {defaultSearchCriteria.place}
          </Text>
          <RecentSearch searchCriteria={defaultSearchCriteria} />
        </View>

        <FlatList
          data={DATA}
          renderItem={({ item }) => <Item title={item.title} />}
          keyExtractor={(item) => item.id}
          horizontal
        />
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default Home;
