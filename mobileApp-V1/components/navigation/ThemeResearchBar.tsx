import {
  View,
  Text,
  FlatList,
  ImageURISource,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import bedColored from "@/assets/icons/bedColored.png";
import automobile from "@/assets/icons/automobile.png";
import airplane from "@/assets/icons/airplane.png";
import taxiIcon from "@/assets/icons/taxiIcon.png";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Séjours",
    icon: bedColored,
  },
  {
    id: "a47acbea-c1b1-46c2-aed5-3ad53abb282a",
    title: "Vols",
    icon: airplane,
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb20cg",
    title: "Voitures",
    icon: automobile,
  },

  {
    id: "aa7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Taxi",
    icon: taxiIcon,
  },
];
type ItemProps = { title: string; icon?: ImageURISource };

const Item = ({ title, icon }: ItemProps) => (
  <Pressable className="flex flex-col gap-4 mx-2 items-center justify-center">
    <Image source={icon} style={{ width: 40, height: 40 }} />
    <Text className="font-lbold text-lg">{title}</Text>
  </Pressable>
);
const ThemeResearchBar = () => {
  return (
    <View className="bg-primary w-full pl-4 pr-1  justify-center">
      <View className="bg-secondary-50 mx-4 rounded-2xl p-2 flex items-center">
        <FlatList
          data={DATA}
          renderItem={({ item }) => (
            <Item title={item.title} icon={item.icon} />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default ThemeResearchBar;
