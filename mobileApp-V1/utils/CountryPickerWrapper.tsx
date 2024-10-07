import React from "react";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";

interface CountryPickerWrapperProps {
  countryCode?: CountryCode;
  withFlag?: boolean;
  withFilter?: boolean;
  withCallingCode?: boolean;
  withCountryNameButton?: boolean;
  onSelect: (country: any) => void;
  containerButtonStyle?: object;
}

const CountryPickerWrapper: React.FC<CountryPickerWrapperProps> = ({
  countryCode = "CM", // Default to Cameroon
  withFlag = true,
  withFilter = true,
  withCallingCode = true,
  withCountryNameButton = true,
  onSelect,
  containerButtonStyle,
}) => {
  return (
    <CountryPicker
      countryCode={countryCode}
      withFlag={withFlag}
      withFilter={withFilter}
      withCallingCode={withCallingCode}
      withCountryNameButton={withCountryNameButton}
      onSelect={onSelect}
      containerButtonStyle={containerButtonStyle}
    />
  );
};

export default CountryPickerWrapper;
