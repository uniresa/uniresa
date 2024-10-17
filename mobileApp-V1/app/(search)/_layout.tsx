import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

const searchLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="searchResults"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="[propertyId]" options={{ headerShown: false }} />
      </Stack>

      {/* <Loader isLoading={loading} /> */}
      <StatusBar backgroundColor="#069494" style="light" />
    </>
  );
};

export default searchLayout;
