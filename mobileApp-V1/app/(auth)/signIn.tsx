import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/generalComponents/CustomButton";
import { Link, router } from "expo-router";
import InputField from "@/components/generalComponents/InputField";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import OAuth from "@/components/generalComponents/Oauth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { signInUser } from "@/utils/authUtils";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const { loading, error } = useSelector(
    (state: RootState) => state.userProfile
  );

  const onSignInPress = async () => {
    await signInUser(form.email, form.password, dispatch, router);
  };
  const handleGoogleSignIn = async () => {
    // TODO: Implement sign in logic here
    console.log("Sign in with email: ", form.email);
    console.log("Sign in with password: ", form.password);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutrals-20">
      <ParallaxScrollView
        headerBackgroundColor="bg-primary"
        closingButton={
          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="absolute bottom-6 left-4"
          >
            <Text className="text-neutrals text-xl font-lbold">X</Text>
          </TouchableOpacity>
        }
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
        <View className="flex flex-col items-center justify-between mt-4 px-4">
          <Text className="text-2xl text-neutrals-900 font-lbold mb-8 ">
            Connectez vous à votre compte
          </Text>

          <View className="w-full mt-4">
            <InputField
              placeholder="Veuillez saisir votre email"
              textContentType="emailAddress"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
              containerStyle="mb-4 p-2"
            />

            <View className="flex flex-col mb-3">
              <InputField
                placeholder="Mot de passe"
                hidePassIcon1={require("@/assets/icons/eyeOff.png")}
                hidePassIcon2={require("@/assets/icons/eyeOn.png")}
                secureTextEntry={true}
                textContentType="password"
                value={form.password}
                onChangeText={(value) => setForm({ ...form, password: value })}
                containerStyle="mb-4 p-2"
              />
              <Link
                href="/home"
                className="text-sm text-right text-primary-600 mr-2"
              >
                Mot de passe oublié?
              </Link>
            </View>

            <CustomButton
              title={loading ? "En cours..." : "Se connecter"}
              handlePress={onSignInPress}
              className="mt-6"
            />
            <View className="flex flex-row justify-center items-center my-6 gap-x-3">
              <View className="flex-1 h-[1px] bg-neutrals-100" />
              <Text className="text-lg">ou</Text>
              <View className="flex-1 h-[1px] bg-neutrals-100" />
            </View>
            <OAuth
              oauthIcon={require("@/assets/icons/google.png")}
              oAuthTitle="Se connecter avec Google"
              handleOAuth={handleGoogleSignIn}
            />
            {/* <OAuth
              oauthIcon={require("@/assets/icons/facebook.png")}
              oAuthTitle="Se connecter avec Facebook"
              handleOAuth={handleFacebookSignIn}
            /> */}
            <View className="mt-8">
              <Text className="text-lg text-center text-neutrals-800">
                Pas de compte?{" "}
              </Text>
              <Link
                href="/signUp"
                className="text-xl text-center text-primary mt-2"
              >
                S'inscrire ici
              </Link>
            </View>
            <CustomButton
              title="Continuer sans se connecter"
              className="bg-neutrals-20 py-3 mt-8 w-full"
              textVariant="primary"
              handlePress={() => router.push("/home")}
            />
          </View>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
