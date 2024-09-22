import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import {
  GooglePlacesAutocomplete,
  AddressComponent,
  PlaceType,
} from "react-native-google-places-autocomplete";
import { SafeAreaView } from "react-native-safe-area-context";

const destinationPicker = () => {
  const googleKey = process.env.EXPO_PUBLIC_GOOGLEAUTOCOMPLETE_URL;
  return (
    <SafeAreaView className="flex-1 bg-neutrals-20">
      <View className="flex flex-row py-3 mx-4">
        <TouchableOpacity
          onPress={() => router.push("/accommodationsListing")}
          className="mr-3"
        >
          <Image
            source={require("@/assets/icons/closingTag.png")}
            className="w-8 h-8"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {/* Google Places Autocomplete */}
      <GooglePlacesAutocomplete
        placeholder="Destination"
        fetchDetails={true}
        debounce={200}
        onPress={(data, details = null) => {
          if (details && details.address_components && details.geometry) {
            // Extract the address and coordinates from Google Autocomplete
            const address = details.address_components;
            const getComponent = (types: PlaceType[]) =>
              address.find((comp) =>
                types.every((type) => comp.types.includes(type))
              )?.long_name || "";

            const selectedDestination = {
              street: getComponent(["route"]),
              quartier: getComponent(["sublocality", "political"]),
              city: getComponent(["locality", "political"]),
              district: getComponent([
                "administrative_area_level_2",
                "political",
              ]),
              region: getComponent([
                "administrative_area_level_1",
                "political",
              ]),
              postalCode: getComponent(["postal_code"]),
              country: getComponent(["country", "political"]),
              latitude: details.geometry.location.lat, // Extract latitude
              longitude: details.geometry.location.lng, // Extract longitude
            };

            // Navigate to accommodations listing with selected destination details
            router.push({
              pathname: "/accommodationsListing",
              params: {
                selectedDestination: JSON.stringify(selectedDestination),
              }, // Serialize the selectedDestination object into a JSON string
            });
          }
        }}
        query={{
          key: googleKey,
          language: "fr", // Set language
        }}
        styles={{
          container: styles.autocompleteContainer,
          textInput: styles.textInput,
          listView: styles.listView,
        }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
  },
  textInput: {
    height: 40,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 1,
    borderColor: "#cccccc",
    backgroundColor: "##f7f7f7",
    paddingHorizontal: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  listView: {
    backgroundColor: "white",
    zIndex: 1000,
  },
});

export default destinationPicker;
