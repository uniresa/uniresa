import { Image, Text, View } from "react-native";
import { Href, router } from "expo-router";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/generalComponents/CustomButton";
export default function Notifications() {
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
        <View className="flex flex-col items-center justify-between pt-4">
          <View className=" text-justify px-2">
            <Text className="text-2xl font-bold text-neutrals-900 mb-6">
              Activez les notifications
            </Text>
            <Text className="text-base text-neutrals-800 leading-6 text-justify">
              Recevez des notifications de Uniresa concernant vos voyages,
              promotions, récompenses, expériences, et informations sur nos
              produits et services. Restez informé(e) des meilleures offres pour
              enrichir votre expérience.
            </Text>
          </View>
          <View className=" w-full mt-36 px-4">
            <View className="mb-4 ">
              <Text className="text-lg text-neutrals-900 font-lbold text-justify">
                Vous pouvez désactiver les notifications à tout moment dans les
                paramètres de l’application.
              </Text>
            </View>
            <View className="my-4">
              <Text className="text-base text-accents font-lbold">
                Consultez notre politique de confidentialité.
              </Text>
            </View>
            <View className="flex flex-col gap-3  items-center">
              <View className="w-full">
                <CustomButton
                  title="Accepter"
                  className="bg-primary py-3"
                  handlePress={() =>
                    router.push("/welcome" as Href<"/welcome">)
                  }
                />
              </View>
              <View className="w-full py-3">
                <CustomButton
                  title="Plus tard"
                  className="bg-neutrals-20 border-2 border-primary"
                  textVariant="primary"
                  handlePress={() =>
                    router.push("/welcome" as Href<"/welcome">)
                  }
                />
              </View>
              <View className="w-full py3">
                <CustomButton
                  title="Refuser"
                  className="bg-neutrals-20"
                  textVariant="primary"
                  handlePress={() =>
                    router.push("/welcome" as Href<"/welcome">)
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}
