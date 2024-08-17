import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import { Link, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import ParallaxScrollView from "@/components/generalComponents/ParallaxScrollView";
export default function HomeScreen() {
 
  return (
    <ParallaxScrollView
      headerBackgroundColor='#069494' 
      headerImage={
        
        <Image
          source={require('@/assets/images/logoblanc24.png')}
          className="absolute bottom-4 left-32 items-center justify-center w-18 h-10"
        />
        
      } >
     
    </ParallaxScrollView>
  );
}
