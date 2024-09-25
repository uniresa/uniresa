import { View, Text, Image, Animated } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomButton from "@/components/generalComponents/CustomButton";

const accommodationOverviewPage = () => {
  const { propertyName } = useLocalSearchParams();
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  // Interpolation to show/hide property name based on scroll position
  const propertyNameOpacity = scrollY.interpolate({
    inputRange: [0, 70], // adjust the second value to control when the property name fades
    outputRange: [0, 1], // not visible at top, appears as you scroll
    extrapolate: "clamp",
  });
  return (
    <SafeAreaView className="flex-1 bg-neutrals-20">
      {/* Fixed Header */}
      <View className="flex flex-row justify-between bg-primary p-6">
        <View className="flex flex-row gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="items-start justify-center ml-4"
          >
            <Image
              source={require("@/assets/icons/arrowWhite.png")}
              className=" w-8 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* Animated property name */}
          <Animated.Text
            style={{
              fontSize: 20,
              color: "#ffffff",
              opacity: propertyNameOpacity, // Only the text opacity changes
            }}
          >
            {propertyName}
          </Animated.Text>
        </View>
        <View className="flex flex-row items-end justify-center gap-6 mr-4">
          <TouchableOpacity onPress={() => router.push("/searchResultsPage")}>
            <Image
              source={require("@/assets/icons/heartWhite.png")}
              className=" w-8 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/searchResultsPage")}>
            <Image
              source={require("@/assets/icons/shareIconWhite.png")}
              className=" w-8 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Scrollable Content */}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // `false` to avoid layout conflicts with animations
        )}
        scrollEventThrottle={16}
      >
        <View className="mt-4 px-4">
          <Text className="font-lbold text-3xl text-neutrals-900">
            {propertyName}
          </Text>
          <Text style={{ marginVertical: 300 }}>Scrollable content here</Text>
          <Text style={{ marginVertical: 300 }}>More content below</Text>
        </View>
      </Animated.ScrollView>
      {/* Fixed Footer */}
      <View className="mx-4 my-4">
        <CustomButton
          title="Sélectionner une chambre"
          classNameTitle="text-2xl font-lbold"
        />
      </View>
    </SafeAreaView>
  );
};

export default accommodationOverviewPage;
