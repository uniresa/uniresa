import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/generalComponents/CustomButton";
import { Link, router } from "expo-router";
import InputField from "@/components/generalComponents/InputField";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import axios from "axios";
import { signInUser } from "@/utils/authUtils";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const dispatch = useDispatch();
  const [userForm, setUserForm] = useState({
    firstName: "",
    surName: "",
    phoneNumber: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    setLoading(true);
    if (userForm.password !== userForm.passwordConfirmation) {
      console.log("Passwords do not match");
      alert("Les mots de passe ne sont pas identiques. Merci de reverifier");
      return;
    }
    try {
      const response = await axios.post(
        "http://192.168.1.181:8080/api/userProfile/create",
        {
          ...userForm,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = response.data;
      if (data.status === "success") {
        console.log(data.message);
        await signInUser(userForm.email, userForm.password, dispatch, router);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(
        "Error detected:",
        error.response?.data?.message || error.message
      );
      setLoading(false);
    }
  };
  const handleGoogleSignUp = async () => {
    // TODO: Implement sign in logic here
    console.log("Sign in with email: ", userForm.email);
    console.log("Sign in with password: ", userForm.password);
  };
  const handleFacebookSignUp = async () => {
    // TODO: Implement sign in logic here
    console.log("Sign in with email: ", userForm.email);
    console.log("Sign in with password: ", userForm.password);
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
              value={userForm.firstName}
              onChangeText={(value) =>
                setUserForm({ ...userForm, firstName: value })
              }
              containerStyle="mb-2"
            />
            <InputField
              placeholder="Nom"
              textContentType="familyName"
              value={userForm.surName}
              onChangeText={(value) =>
                setUserForm({ ...userForm, surName: value })
              }
              containerStyle="mb-2"
            />
            <InputField
              placeholder="Numéro de téléphone"
              textContentType="telephoneNumber"
              value={userForm.phoneNumber}
              onChangeText={(value) =>
                setUserForm({ ...userForm, phoneNumber: value })
              }
              containerStyle="mb-2"
            />
            <InputField
              placeholder="Addresse e-mail"
              textContentType="emailAddress"
              value={userForm.email}
              onChangeText={(value) =>
                setUserForm({ ...userForm, email: value })
              }
              containerStyle="mb-2"
            />
            <InputField
              placeholder="Mot de passe"
              hidePassIcon1={require("@/assets/icons/eyeOff.png")}
              hidePassIcon2={require("@/assets/icons/eyeOn.png")}
              // iconStyle="absolute right-4"
              secureTextEntry={true}
              textContentType="password"
              value={userForm.password}
              onChangeText={(value) =>
                setUserForm({ ...userForm, password: value })
              }
            />
            <InputField
              placeholder="Confirmation du mot de passe"
              hidePassIcon1={require("@/assets/icons/eyeOff.png")}
              hidePassIcon2={require("@/assets/icons/eyeOn.png")}
              secureTextEntry={true}
              textContentType="password"
              value={userForm.passwordConfirmation}
              onChangeText={(value) =>
                setUserForm({ ...userForm, passwordConfirmation: value })
              }
            />
            <CustomButton
              title={loading ? "creation du client..." : "Enregistrement"}
              handlePress={onSignUpPress}
              classNameLocal="mt-4"
            />
            <Text className="text-sm text-justify  text-neutrals-800 mt-4">
              En vous inscrivant, vous adhérez a nos conditions générales
              d’utilisation (CGU). vous pouvez trouver des inuserFormations
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
