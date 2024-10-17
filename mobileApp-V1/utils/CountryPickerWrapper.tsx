import React, { useState } from "react";
import CountryPicker, { CountryCode, Country  } from "react-native-country-picker-modal";
import { CountryPickerWrapperProps } from "@/typesDeclaration/types";
import { Image, TouchableOpacity } from "react-native";

const CountryPickerWrapper: React.FC<CountryPickerWrapperProps> = ({
  countryCode = "CM", // Default to Cameroon
  withFlag = true,
  withFilter = true,
  withCallingCode = true,
  withCountryNameButton = true,
  onSelect,
  containerButtonStyle,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelectCountry = (country: Country) => {
    onSelect(country);
    setIsVisible(false); // Close the picker after selecting a country
  };

  const handlePress = () => {
    setIsVisible(true); // Open the picker when TouchableOpacity is pressed
  };
  return (
    <TouchableOpacity
    onPress={handlePress}
      style={[
        { flexDirection: "row", alignItems: "center" },
        containerButtonStyle,
      ]}
    >
      <CountryPicker
        countryCode={countryCode}
        withFlag={withFlag}
        withFilter={withFilter}
        withCallingCode={withCallingCode}
        withCountryNameButton={withCountryNameButton}
        // onSelect={onSelect}
        containerButtonStyle={{ flex: 1 }}
        onSelect={handleSelectCountry}
        visible={isVisible} // Control the visibility of the picker
        onClose={() => setIsVisible(false)} 
      />
      <Image
        source={require("@/assets/icons/arrowDown.png")}
        className="w-6 h-6 m-2"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default CountryPickerWrapper;
