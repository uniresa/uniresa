import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { EXPO_PUBLIC_GOOGLE_API_KEY } from "@env";

interface DestinationPickerProps {
  isVisible: boolean;
  searchDestination: string;
  onClose: () => void;
  onConfirm: (searchDestination: string) => void;
}

const DestinationPickerModal: React.FC<DestinationPickerProps> = ({
  isVisible,
  searchDestination,
  onClose,
  onConfirm,
}) => {
  const [selectedDestination, setSelectedDestination] =
    useState(searchDestination);

  if (!isVisible) return null; // If modal is not visible, return null

  return (
    <View style={styles.fullScreenContainer}>
      {/* Back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Image
            source={require("@/assets/icons/backArrow.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Choisissez une destination</Text>
      </View>

      {/* Google Places Autocomplete */}
      <GooglePlacesAutocomplete
        placeholder="Saisissez la destination"
        fetchDetails={true}
        debounce={200}
        onPress={(data, details = null) => {
          if (data && data.description) {
            setSelectedDestination(data.description);
            onConfirm(data.description); // Confirm immediately on selection
            onClose(); // Close modal after selection
          }
        }}
        query={{
          key: EXPO_PUBLIC_GOOGLE_API_KEY,
          language: "fr", // Set language
        }}
        styles={{
          container: styles.autocompleteContainer,
          textInput: styles.textInput,
          listView: styles.listView,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  autocompleteContainer: {
    flex: 1,
  },
  textInput: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 10,
    fontSize: 16,
  },
  listView: {
    backgroundColor: "white",
    zIndex: 1000,
  },
});

export default DestinationPickerModal;
