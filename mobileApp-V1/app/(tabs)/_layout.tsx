import { Tabs, Redirect, router } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserProfile } from "@/typesDeclaration/types";
import { Pressable } from "react-native";

export default function TabLayout() {
  const { user } = useSelector((state: RootState) => state.userProfile) as {
    user: UserProfile | null;
  };

  const UserProfileNavigation = () => {
    if (user) {
      router.push("/userProfile"); // Navigate to userProfile screen
    } else {
      router.push("/signIn"); // Navigate to signIn screen if no user
    }
  };
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
          name="userProfile"
          options={{
            title: "userProfile",
            tabBarIcon: ({ color, focused }) => (
              <Pressable onPress={UserProfileNavigation}>
                <TabBarIcon
                  name={user ? "Profile" : "Se connecter"}
                  color={color}
                  icon={require("@/assets/icons/profileIcon.png")}
                  focused={focused}
                />
              </Pressable>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              UserProfileNavigation();
            },
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#069494" style="light" />
    </>
  );
}
