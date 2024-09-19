import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const screensLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="accommodationsListing"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="destinationPicker"
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

export default screensLayout;
