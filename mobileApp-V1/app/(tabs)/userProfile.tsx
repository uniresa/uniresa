import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileCard from "@/components/generalComponents/ProfileCard";
import CustomButton from "@/components/generalComponents/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/userSlice";
import { logedOut } from "@/redux/slices/authSlice";
import { router } from "expo-router";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.userProfile);
  const onSignOut = async () => {
    try {
      await auth().signOut();
      dispatch(logedOut());
      dispatch(logout());
      Alert.alert("Déconnexion réussie");
    } catch (error) {
      Alert.alert("Erreur lors de la déconnexion");
    }
    router.push("/signIn");
  };
  return (
    <SafeAreaView className="flex-1 bg-neutrals-20">
      <ScrollView>
        {user ? (
          <>
            <ProfileCard profile={user} />
            <View className="flex flex-col items-center m-2 bg-warning-50 rounded-2xl p-4">
              <Image
                source={require("@/assets/icons/discountCardActive.png")}
                className="w-8 h-8"
              />
              <Text className="text-lg font-lbold text-neutrals-900 mb-2">
                uniresa Benef
              </Text>
              <Text className="text-base text-neutrals-800 font-lregular mb-4">
                Vous avez actuellement:{" "}
                <Text className="text-base text-neutrals-900 font-lbold">
                  1000 uniPoints
                </Text>
              </Text>
              <View className="flex flex-row  my-1 gap-x-3">
                <View className="flex-1 h-[2px] bg-neutrals-40" />
              </View>
              <Text className="text-primary text-lg font-lbold">
                Plus d'action pour plus de points
              </Text>
            </View>
            <View className="flex flex-col items-start my-1 mx-2 bg-secondary-100 rounded-2xl p-4">
              <Text className="text-xl font-lbold text-secondary-800 mb-2">
                Solde:{" "}
                <Text className="text-lg font-bold text-warning-600">
                  15000 Fcfa
                </Text>
              </Text>
              <Text className="text-base font-lregular text-secondary-800 mb-2">
                Rechargez votre compte par CB (carte bancaire), OM ou MoMo
              </Text>
            </View>
            <View className="flex flex-row bg-neutrals-20 justify-between rounded-2xl m-2 border-2 border-neutrals-60">
              <Pressable className="flex-1 flex flex-col items-center gap-2  px-2 py-2 ">
                <Image
                  source={require("@/assets/icons/reservationBag.png")}
                  style={{ width: 40, height: 40 }}
                />
                <Text className="text-sm text-center font-lbold text-neutrals-800 ">
                  Mes reservations
                </Text>
              </Pressable>
              <Pressable className="flex-1 flex flex-col items-center gap-2  px-2 py-2 ">
                <Image
                  source={require("@/assets/icons/favorisIcon.png")}
                  style={{ width: 40, height: 40 }}
                />
                <Text className="text-sm text-center font-lbold text-neutrals-800 ">
                  Mes Favoris
                </Text>
              </Pressable>
              <Pressable className="flex-1 flex flex-col items-center gap-2  px-2 py-2 ">
                <Image
                  source={require("@/assets/icons/creditCard.png")}
                  style={{ width: 40, height: 40 }}
                />
                <Text className="text-sm text-center font-lbold text-neutrals-800 ">
                  Mes cartes bancaires
                </Text>
              </Pressable>
            </View>
            <View className="flex flex-row bg-neutrals-20 justify-between rounded-2xl m-2 border-2 border-neutrals-60">
              <Pressable className="flex-1 flex flex-col items-center gap-2  px-2 py-2 ">
                <Image
                  source={require("@/assets/icons/addPerson.png")}
                  style={{ width: 40, height: 40 }}
                />
                <Text className="text-sm text-center font-lbold text-neutrals-800 ">
                  Invitez et gagnez
                </Text>
              </Pressable>
              <Pressable className="flex-1 flex flex-col items-center gap-2  px-2 py-2">
                <Image
                  source={require("@/assets/icons/discountOutline.png")}
                  style={{ width: 40, height: 40 }}
                />
                <Text className="text-sm text-center font-lbold text-neutrals-800 ">
                  Pack de bienvenu
                </Text>
              </Pressable>
              <Pressable className="flex-1 flex flex-col items-center gap-2  px-2 py-2">
                <Image
                  source={require("@/assets/icons/starNobg.png")}
                  style={{ width: 40, height: 40 }}
                />
                <Text className="text-sm text-center font-lbold text-neutrals-800 ">
                  Notez l'application
                </Text>
              </Pressable>
            </View>
            <View className="flex flex-row bg-neutrals-20 justify-between rounded-2xl m-2 border-2 border-neutrals-60">
              <Pressable className="flex-1 flex flex-col items-center gap-2  px-2 py-2">
                <Image
                  source={require("@/assets/icons/customerCare.png")}
                  style={{ width: 40, height: 40 }}
                />
                <Text className="text-sm text-center font-lbold text-neutrals-800 ">
                  Service client
                </Text>
              </Pressable>
              <Pressable className="flex-1 flex flex-col items-center gap-2  px-2 py-2">
                <Image
                  source={require("@/assets/icons/infoIcon.png")}
                  style={{ width: 40, height: 40 }}
                />
                <Text className="text-sm text-center font-lbold text-neutrals-800 ">
                  A propos de uniresa
                </Text>
              </Pressable>
              <Pressable className="flex-1 flex flex-col items-center  gap-2  px-2 py-2">
                <Image
                  source={require("@/assets/icons/cgv.png")}
                  style={{ width: 40, height: 40 }}
                />
                <Text className="text-sm text-center font-lbold text-neutrals-800 ">
                  Conditions generales
                </Text>
              </Pressable>
            </View>
            <CustomButton
              title="Se deconnecter"
              handlePress={onSignOut}
              className="my-6"
            />
          </>
        ) : (
          ""
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;
