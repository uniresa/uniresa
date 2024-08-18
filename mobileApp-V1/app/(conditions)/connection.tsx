import { StatusBar } from "expo-status-bar";
import {
  Image,
  Text,
  View,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, router, useNavigation } from "expo-router";
import disc from "@jsamr/counter-style/presets/disc";
import MarkedList from "@jsamr/react-native-li";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import { SafeAreaView } from "react-native-safe-area-context";
import TextButton from "@/components/generalComponents/TextButton";
export default function Connection() {
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
        <View className="flex flex-col items-center pt-2">
          <View className="text-justify mb-10">
            <View>
              <Text className="text-xl font-bold text-neutrals-neutrals-n900 font-rbold">
                Bienvenue chez uniresa!
              </Text>
              <Text className="text-base mt-6 mb-4 text-justify">
                Inscrivez vous et connectez vous pour profiter de divers
                avantages:
              </Text>
            </View>
            <View className="">
              <Text className="p-1 font-lregular text-base">
                <MaterialIcons name="check-circle" size={24} color="#07a872" />{" "}
                Réservations rapides
              </Text>
              <Text className="p-1 font-lregular text-base">
                <MaterialIcons name="check-circle" size={24} color="#07a872" />{" "}
                Enregistrer mes recherches et favoris
              </Text>
              <Text className="p-1 font-lregular text-base">
                <MaterialIcons name="check-circle" size={24} color="#07a872" />{" "}
                Suivi de mes réservations
              </Text>
              <Text className="p-1 font-lregular text-base">
                <MaterialIcons name="check-circle" size={24} color="#07a872" />{" "}
                Retour sur le déroulé de mes réservations
              </Text>
              <Text className="p-1 font-lregular text-base">
                <MaterialIcons name="check-circle" size={24} color="#07a872" />{" "}
                Reductions clients fideles
              </Text>
            </View>
          </View>
          <View className="flex w-full ">
            <View className="flex flex-col gap-2  items-center">
              <View className="w-full">
                <TextButton
                  title="Se connecter"
                  containerStyles="bg-primary"
                  textStyle="text-align:center"
                  handlePress={() => router.push("/signIn")}
                />
              </View>
              <View className="w-full">
                <TextButton
                  title="S'inscrire"
                  containerStyles="bg-neutrals border-2 border-primary"
                  textStyle="text-align:center text-primary"
                  handlePress={() => router.push("/signUp")}
                />
              </View>
              <View className="w-full">
                <TextButton
                  title="Continuer sans se connecter"
                  containerStyles="bg-neutrals-neutrals-n20"
                  textStyle="text-align:center text-primary"
                  handlePress={() => router.push("/home")}
                />
              </View>
            </View>
            <View className="flex mt-10">
              <Text className="text-base text-neutrals-neutrals-n900 font-lbold">
                En creant ou en vous connectant a un compte, vous acceptez nos
                <Text className="text-accents underline hover:underline-offset-4">
                  {" "}
                  conditions generales{" "}
                </Text>{" "}
                et notre{" "}
                <Text className="text-accents underline hover:underline-offset-4">
                  charte de confidentialite
                </Text>
                .
              </Text>
            </View>
            <View className="flex items-center mt-6">
              <Text className="text-lg font-lbold">
                @2024 copyright uniresa sarl
              </Text>
            </View>
          </View>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}
