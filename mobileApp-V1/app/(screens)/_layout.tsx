import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

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
        <Stack.Screen
          name="bookingRecap"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="bookingConfirmation"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="bookingPaymentScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="bookingPersonForm"
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
