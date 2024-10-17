import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Platform,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { InputFieldProps } from "@/typesDeclaration/types";

const InputField = ({
  label,
  isRequired,
  icon,
  hidePassIcon1,
  hidePassIconStyle1,
  hidePassIcon2,
  hidePassIconStyle2,
  secureTextEntry,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`my-2 w-full ${className}`}>
          <View className="flex flex-row">
            {label && (
              <Text className={`text-base font-lregular mb-4 ${labelStyle}`}>
                {label}
              </Text>
            )}
            {isRequired && <Text className="text-accents text-xl"> *</Text>}
          </View>
          <View
            className={`flex flex-row w-full justify-start items-center relative bg-neutrals-20 rounded-2xl border-4 border-neutrals-40 focus:border-primary-200  ${containerStyle}`}
          >
            <TextInput
              className={`rounded-2xl p-2 font-lregular text-base ${inputStyle} text-left`}
              secureTextEntry={isPasswordVisible}
              {...props}
            />
            {icon && (
              <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
            )}
            {hidePassIcon1 && hidePassIcon2 && (
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                className={`absolute right-3  ${hidePassIconStyle1}`}
              >
                <Image
                  source={isPasswordVisible ? hidePassIcon1 : hidePassIcon2}
                  className={`w-6 h-6 ml-4 ${hidePassIconStyle2}`}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
