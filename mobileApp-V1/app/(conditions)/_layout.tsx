import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const conditionsLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="cookies"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {/* <Loader isLoading={loading} /> */}
      <StatusBar backgroundColor="#069494" style="light" />
    </>
  );
};

export default conditionsLayout;

