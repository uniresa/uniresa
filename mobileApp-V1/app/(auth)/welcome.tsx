import { Image, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/generalComponents/CustomButton";
export default function Welcome() {
  return (
    <SafeAreaView className="bg-neutrals-20 flex-1">
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
        <View className="flex flex-col items-center pt-4">
          <View className="px-6 mb-10">
            <Text className="text-2xl font-bold text-neutrals-900 mb-4">
              Bienvenue chez uniresa!
            </Text>
            <Text className="text-base text-neutrals-800 mb-6 text-justify">
              Inscrivez vous et connectez vous pour profiter de divers
              avantages:
            </Text>

            <View>
              {[
                "Réservations rapides",
                "Enregistrer mes recherches et favoris",
                "Suivi de mes réservations",
                "Retour sur le déroulé de mes réservations",
                "Réductions clients fidèles",
              ].map((item, index) => (
                <Text
                  key={index}
                  className="p-1 text-base font-lregular flex flex-row items-center"
                >
                  <MaterialIcons
                    name="check-circle"
                    size={24}
                    color="#07a872"
                  />{" "}
                  {item}
                </Text>
              ))}
            </View>
          </View>
          <View className="px-6 w-full ">
            <View className="flex flex-col gap-2  items-center mb-8">
              <CustomButton
                title="Se connecter"
                className="bg-primary py-3 mb-4 w-full"
                handlePress={() => router.push("/signIn")}
              />
              <CustomButton
                title="S'inscrire"
                className="bg-neutrals-20 mb-4 border-2 border-primary py-3 w-full"
                textVariant="primary"
                handlePress={() => router.push("/signUp")}
              />
              <CustomButton
                title="Continuer sans se connecter"
                className="bg-neutrals-20 py-3  w-full"
                textVariant="primary"
                handlePress={() => router.push("/home")}
              />
            </View>
            <View className="mb-6">
              <Text className="text-sm text-neutrals-800 font-lbold">
                En créant ou en vous connectant à un compte, vous acceptez nos
                <Text className="text-accents underline">
                  {" "}
                  conditions générales{" "}
                </Text>{" "}
                et notre{" "}
                <Text className="text-accents underline">
                  charte de confidentialité
                </Text>
                .
              </Text>
            </View>
            <View className="flex items-center mt-4">
              <Text className="text-sm font-lbold text-center">
                @2024 copyright uniresa sarl
              </Text>
            </View>
          </View>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}
