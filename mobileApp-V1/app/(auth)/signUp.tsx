import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/generalComponents/CustomButton";
import { Link, router } from "expo-router";
import InputField from "@/components/generalComponents/InputField";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";

const SignUp = () => {
  const [form, setForm] = useState({
    firstname: "",
    surName: "",
    phoneNumber: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const onSignUpPress = () => {
    // TODO: Implement sign in logic here
    console.log("Sign in with email: ", form.email);
    console.log("Sign in with password: ", form.password);
  };
  const handleGoogleSignUp = async () => {
    // TODO: Implement sign in logic here
    console.log("Sign in with email: ", form.email);
    console.log("Sign in with password: ", form.password);
  };
  const handleFacebookSignUp = async () => {
    // TODO: Implement sign in logic here
    console.log("Sign in with email: ", form.email);
    console.log("Sign in with password: ", form.password);
  };
  return (
    <SafeAreaView className="flex-1 bg-neutrals-20">
      <ParallaxScrollView
        closingButton={
          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="absolute bottom-6 left-4"
          >
            <Text className="text-neutrals text-xl font-lbold">X</Text>
          </TouchableOpacity>
        }
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
        <View className="flex flex-col items-start justify-between mt-2 px-4">
          <Text className="text-2xl text-neutrals-900 font-lbold mb-2">
            Enregistrez vous ici
          </Text>

          <View className="w-full mt-2">
            <InputField
              placeholder="Prenom"
              textContentType="name"
              value={form.firstname}
              onChangeText={(value) => setForm({ ...form, firstname: value })}
              containerStyle="mb-2"
            />
            <InputField
              placeholder="Nom"
              textContentType="familyName"
              value={form.surName}
              onChangeText={(value) => setForm({ ...form, surName: value })}
              containerStyle="mb-2"
            />
            <InputField
              placeholder="Numéro de téléphone"
              textContentType="telephoneNumber"
              value={form.phoneNumber}
              onChangeText={(value) => setForm({ ...form, phoneNumber: value })}
              containerStyle="mb-2"
            />
            <InputField
              placeholder="Addresse e-mail"
              textContentType="emailAddress"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
              containerStyle="mb-2"
            />
            <InputField
              placeholder="Mot de passe"
              hidePassIcon1={require("@/assets/icons/eyeOff.png")}
              hidePassIcon2={require("@/assets/icons/eyeOn.png")}
              // iconStyle="absolute right-4"
              secureTextEntry={true}
              textContentType="password"
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />
            <InputField
              placeholder="Confirmation du mot de passe"
              hidePassIcon1={require("@/assets/icons/eyeOff.png")}
              hidePassIcon2={require("@/assets/icons/eyeOn.png")}
              secureTextEntry={true}
              textContentType="password"
              value={form.passwordConfirmation}
              onChangeText={(value) =>
                setForm({ ...form, passwordConfirmation: value })
              }
            />
            <CustomButton
              title="Enregistrement"
              handlePress={onSignUpPress}
              className="mt-4"
            />
            <Text className="text-sm text-justify  text-neutrals-800 mt-4">
              En vous inscrivant, vous adhérez a nos conditions générales
              d’utilisation (CGU). vous pouvez trouver des informations
              supplémentaires dans notre{" "}
              <Link href={"/home"} className="text-primary-400">
                déclaration de confidentialité.
              </Link>
            </Text>
            <View className="flex flex-row mt-4">
              <Text className="text-sm text-center text-neutrals-800">
                Vous avez deja un compte?{" "}
              </Text>
              <Link
                href="/signIn"
                className="text-sm text-center text-primary-600 "
              >
                Connectez vous ici
              </Link>
            </View>
          </View>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
