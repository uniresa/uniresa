import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
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
          if (data && data.description) {
            router.push({
              pathname: "/accommodationsListing",
              params: { selectedDestination: data.description }, // Pass selected destination as a param
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
