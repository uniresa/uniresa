import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const authLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="signIn"
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="signUp"
          options={{
            headerShown: true,
          }}
        />
      </Stack>

      {/* <Loader isLoading={loading} /> */}
      <StatusBar backgroundColor="#069494" style="light" />
    </>
  );
};

export default authLayout;
