import axios from "axios";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/redux/slices/userSlice";
import { logedIn, logedOut } from "@/redux/slices/authSlice";
import { Dispatch } from "redux";

export const signInUser = async (
  email: string,
  password: string,
  dispatch: Dispatch,
  router: any
) => {
  dispatch(loginStart());
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    if (!userCredential.user) {
      dispatch(loginFailure("Failed to sign in"));
      Alert.alert("Error", "Failed to sign in");
      return;
    }

    const idToken = await userCredential.user.getIdToken(); // Get Firebase ID Token
    console.log("User signed in:", userCredential.user.uid);
    console.log("Token:", idToken);

    const response = await axios.get(
      `http://192.168.1.181:8080/api/userProfile/get/${userCredential.user.uid}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        withCredentials: true,
      }
    );

    const userData = response.data;

    if (userData.status === "failed") {
      dispatch(loginFailure(userData.message));
      Alert.alert("Error", userData.message);
      return;
    }

    console.log("User data received from backend:", userData);
    dispatch(loginSuccess(userData.user)); // Store user data in global state
    dispatch(logedIn()); // Mark the user as logged in globally

    Alert.alert("Success", "Signed in successfully!");
    router.push("/home");
  } catch (error: any) {
    console.error("Error signing in:", error);
    dispatch(loginFailure(error.response?.data?.message || error.message));
    Alert.alert("Error", error.response?.data?.message || error.message);
  }
};
