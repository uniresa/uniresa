import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import { Link, router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import { SafeAreaView } from "react-native-safe-area-context";
import TextButton from "@/components/generalComponents/TextButton";
export default function Notifications() {
  return (
    <SafeAreaView className="bg-neutrals-neutrals-n20 h-full">
      <StatusBar backgroundColor="#069494" style="light" />
      <ParallaxScrollView
        headerBackgroundColor="bg-primary"
        notificationIcon={
          <Image
            source={require("@/assets/icons/notificationOnBg.png")}
            className="hidden absolute bottom-4 right-4 w-8 h-8"
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
        <View className="flex flex-col items-center justify-between pt-4">
          <View className="p-0 text-justify">
            <Text className="text-2xl font-bold text-neutrals-neutrals-n900 font-rbold">
              Parametres des cookies
            </Text>
            <Text className="text-lg mt-6 mb-6 text-justify">
              Activez les notifications de uniresa relatives aux voyages et au
              marketing contenant notamment des promotions, des recompenses, des
              experiences de voyage et des informations sur les produits et
              services de uniresa.
            </Text>
          </View>
          <View className="flex w-full mt-56">
            <View className="flex ">
              <Text className="text-lg text-neutrals-neutrals-n900 font-lbold">
                Vous pouvez les désactiver a tout moment.
              </Text>
            </View>
            <View className="flex my-8">
              <Text className="text-lg text-accents font-lbold">
                Lire la charte de confidentialite.
              </Text>
            </View>
            <View className="flex flex-col gap-3  items-center">
              <View className="w-full">
                <TextButton
                  title="Accepter"
                  containerStyles="bg-primary"
                  textStyle="text-align:center"
                  handlePress={() => router.push("/connection")}
                />
              </View>
              <View className="w-full">
                <TextButton
                  title="Plus tard"
                  containerStyles="bg-neutrals border-2 border-primary"
                  textStyle="text-align:center text-primary"
                  handlePress={() => router.push("/connection")}
                />
              </View>
              <View className="w-full">
                <TextButton
                  title="Refuser"
                  containerStyles="bg-neutrals-neutrals-n20"
                  textStyle="text-align:center text-primary"
                  handlePress={() => router.push("/connection")}
                />
              </View>
            </View>
          </View>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}
