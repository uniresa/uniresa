import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { PropsWithChildren, useState } from "react";
import { ButtonProps } from "@/typesDeclaration/types";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "secondary":
      return "bg-secondary";
    case "warning":
      return "bg-warning";
    case "success":
      return "bg-secondary-100";
    case "outline":
      return "bg-transparent border-neutrals-40 border-[0.5px]";
    default:
      return "bg-primary";
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-primary";
    case "secondary":
      return "text-neutrals-900";
    case "danger":
      return "text-accents";
    case "success":
      return "text-secondary-800";
    default:
      return "text-white";
  }
};

const CustomButton = ({
  handlePress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  classNameLocal,
  classNameTitle,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`w-full rounded-3xl min-h-[52px] p-3 flex flex-row justify-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(
        bgVariant
      )} ${classNameLocal}`}
      {...props}
    >
      {IconLeft && <IconLeft />}
      <Text
        className={`font-rbold text-base ${getTextVariantStyle(
          textVariant
        )} ${classNameTitle}`}
      >
        {title}
      </Text>
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
};

export default CustomButton;
