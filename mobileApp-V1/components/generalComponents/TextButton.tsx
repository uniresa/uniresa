import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
  containerStyles: string;
  textStyle: string;
  isLoading?: boolean;
  handlePress: () => void;
}>;
const TextButton = ({
  title,
  containerStyles,
  textStyle,
  isLoading,
  handlePress,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-primary rounded-3xl min-h-[52px] px-4 flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text className={`text-neutrals font-rbold text-base ${textStyle}`}>{title}</Text>
      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default TextButton;
