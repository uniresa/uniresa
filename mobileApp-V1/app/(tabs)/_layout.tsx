import { Tabs, Redirect } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { StatusBar } from "expo-status-bar";
import { Image, View } from "react-native";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: "#058787",
          tabBarInactiveTintColor: "#626262",
          tabBarStyle: {
            backgroundColor: "#f7f7f7",
            borderTopColor: "#e4e4e4",
            borderTopWidth: 1,
            height: 84,
            width: "100%",
          },
          headerStyle: {
            backgroundColor: "#069494", // Set your header color here
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Acceuil",
            // headerTitle: () => (
            //   <View className="relative flex-row items-center justify-center w-96 gap-8 border ">
            //     {/* <View className="flex items-center justify-center"> */}
            //     <Image
            //       source={require("@/assets/images/logoblanc24.png")}
            //       style={{ width: 120, height: 40 }}
            //       resizeMode="contain"
            //     />
            //     {/* </View>
            //     <View className="absolute right-1"> */}
            //     <Image
            //       source={require("@/assets/icons/notificationDefault.png")}
            //       style={{
            //         width: 24,
            //         height: 24,
            //         tintColor: "#ffffff",
            //         position: "absolute",
            //         right: 16,
            //       }}
            //       resizeMode="contain"
            //     />
            //     {/* </View> */}
            //   </View>
            // ),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name="Acceuil"
                color={color}
                icon={require("@/assets/icons/homeIcon.png")}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="favoris"
          options={{
            title: "Favoris",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name="Favoris"
                color={color}
                icon={require("@/assets/icons/favorisIcon.png")}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="reservations"
          options={{
            title: "Reservations",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name="Reservations"
                color={color}
                icon={require("@/assets/icons/reservationBag.png")}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="contact"
          options={{
            title: "Contact",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name="Contact"
                color={color}
                icon={require("@/assets/icons/customerCare.png")}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name="Profile"
                color={color}
                icon={require("@/assets/icons/profileIcon.png")}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#069494" style="light" />
    </>
  );
}
