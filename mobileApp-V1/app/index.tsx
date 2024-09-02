import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import { router } from "expo-router";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/generalComponents/CustomButton";
import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-neutrals-20 flex-1">
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
        <View className="flex flex-col items-center justify-between p-4">
          <View>
            <Text className="text-2xl font-bold text-neutrals-900 mb-4">
              Parametres des cookies
            </Text>
            <Text className="text-base text-justify text-neutrals-800 leading-6">
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
          <View className=" my-8 ">
            <Text className="text-base mt-12 text-justify text-neutrals-800 leading-6">
              Gerez vos autorisations et apprenez-en plus sur les cookies et les
              technologies similaires que nous utilisons.
            </Text>
          </View>
          <View className="flex flex-row gap-4 w-full justify-center">
            <View className="w-[40%]">
              <CustomButton
                title="Refuser"
                className="bg-primary py-3"
                handlePress={() => router.push("/notifications")}
              />
            </View>
            <View className="w-[40%]">
              <CustomButton
                title="Accepter"
                className="bg-primary py-3"
                handlePress={() => router.push("/notifications")}
              />
            </View>
          </View>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}
