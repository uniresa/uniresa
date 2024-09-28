import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const screensLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="accommodationServices"
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
