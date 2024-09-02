import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/generalComponents/CustomButton";
import { Link, router } from "expo-router";
import InputField from "@/components/generalComponents/InputField";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
import OAuth from "@/components/generalComponents/Oauth";
import auth, { signInWithEmailAndPassword } from "@react-native-firebase/auth";
import axios from "axios";
import Cookies from "js-cookie";

const SignIn = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // Fetch CSRF token from the backend
        const response = await axios.get(
          "http://192.168.1.181:8080/api/csrf-token",
          { withCredentials: true }
        );
        Cookies.set("XSRF-TOKEN", response.data.csrfToken); // Store CSRF token in cookies
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
        Alert.alert("Error", "Failed to fetch CSRF token.");
      }
    };
    fetchCsrfToken();
  }, []);

  const onSignInPress = async () => {
    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        form.email,
        form.password
      );
      const idToken = await userCredential.user.getIdToken(); // Get Firebase ID Token

      console.log("User signed in:", userCredential.user);
      console.log("Token:", idToken);

      // Fetch CSRF token if not available
      if (!Cookies.get("XSRF-TOKEN")) {
        const response = await axios.get(
          "http://192.168.1.181:8080/api/csrf-token",
          { withCredentials: true }
        );
        Cookies.set("XSRF-TOKEN", response.data.csrfToken);
      }

      // Send token to your backend server for verification or other purposes
      await axios.post(
        "http://192.168.1.181:8080/api/auth/verify-token",
        { idToken },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
            "CSRF-Token": Cookies.get("XSRF-TOKEN"), // Include CSRF token from cookies
          },
          withCredentials: true,
        }
      );

      Alert.alert("Success", "Signed in successfully!");
      router.push("/userProfile");
    } catch (error: any) {
      console.error("Error signing in:", error);
      Alert.alert("Error", error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Stop loading
    }
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

          <View className="w-full mt-8">
            <InputField
              placeholder="Veuillez saisir votre email"
              // icon={icons.email}
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
                // iconStyle="absolute right-4"
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
              title="Sign In"
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
            <View className="mt-20">
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
          </View>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
