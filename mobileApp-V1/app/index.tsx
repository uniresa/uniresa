import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import { Link, router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import { SafeAreaView } from "react-native-safe-area-context";
import TextButton from "@/components/generalComponents/TextButton";
export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-neutral-100 h-full">
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
          <View className="text-justify">
            <Text className="text-xl font-bold text-neutrals-neutrals-n900 font-rbold">
              Parametres des cookies
            </Text>
            <Text className="text-base mt-4 mb-2 text-justify">
              En cliquant sur accpter, vous acceptez l utilisation de cookies
              analytiques et de technologies siilaires utilisees pour obtenir
              des donnees sur l’utilisation de l’appli et pour ameliorer nos
              services. Vous acceptez egalement que uniresa et ses partenaires
              de confiance utilisent des technologies de suivi qui perettent de
              deteriner les produits que vous voyez ou non sur notre site et
              notre appli, et de mesurer le trafic sur ns plateformes. ces
              technologies de suivi vous permettent egalement d’aimer ou
              partager certains elements directement sur vos reseaux sociaux.
            </Text>
          </View>
          <View className="flex">
            <View className="flex my-4">
              <Text className="text-base mt-24 text-justify">
                Gerez vos autorisations et apprenez-en plus sur les cookies et
                les technologies similaires que nous utilisons.
              </Text>
            </View>
            <View className="flex flex-row gap-6 p-4 items-center">
              <View className="w-[40%]">
                <TextButton
                  title="Refuser"
                  containerStyles="bg-primary"
                  textStyle="text-align:center"
                  handlePress={() => router.push("/notifications")}
                />
              </View>
              <View className="w-[40%]">
                <TextButton
                  title="Accepter"
                  containerStyles="bg-primary"
                  textStyle="text-align:center"
                  handlePress={() => router.push("/notifications")}
                />
              </View>
            </View>
          </View>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}
