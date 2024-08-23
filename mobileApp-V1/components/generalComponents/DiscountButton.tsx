import { View, Text, Image, Pressable } from "react-native";
import React, { ReactElement } from "react";

interface DiscountButtonProps {
  discount?: string | number;
  handleClick?: () => void;
  discuntIcon?: ReactElement;
  buttonText?: string;
  discountButtonBgColor?: string;
  buttonTextColor?: string;
}
const DiscountButton: React.FC<DiscountButtonProps> = ({
  discount,
  handleClick,
  discuntIcon,
  buttonText,
  discountButtonBgColor,
  buttonTextColor,
}) => {
  return (
    <Pressable
      onPress={handleClick}
      className={`flex flex-row self-start items-center space-x-2 rounded-xl px-2 py-1 ${discountButtonBgColor}`}
    >
      {discuntIcon}
      <Text className={`font-lbold font-bold text-sm ${buttonTextColor}`}>
        {discount
          ? `-${discount} %`
          : discount && buttonText
          ? `${buttonText} -${discount} %`
          : buttonText
          ? `${buttonText}`
          : ""}
      </Text>
    </Pressable>
  );
};

export default DiscountButton;
