import React, { ReactNode } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RoomCard from "./RoomCard";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { selectSearchCriteria } from "@/redux/slices/searchCriteriaSlice";
import moment from "moment";
import "moment/locale/fr";

interface FullScreenModalProps {
  toggleModal: () => void; // Function to toggle the modal visibility
  openModal: boolean; // Boolean to control modal visibility
  title?: string; // Optional title for the modal, default provided in the component
  data?: Array<any>; // Optional data array for rendering content (e.g., amenities)
  renderContent?: () => ReactNode; // Optional function to render custom content
  renderFooter?: () => ReactNode; // Optional function to render footer (e.g., actions or buttons)
}

// FullScreenModal Component with TypeScript
const FullScreenModal: React.FC<FullScreenModalProps> = ({
  toggleModal,
  openModal,
  title = "Belle hotel",
  data = [], // Default empty array for data
  renderContent,
  renderFooter,
}) => {
  const { dates } = useSelector(selectSearchCriteria);
  const handleSelectRoom = (roomId: string) => {
    console.log(`Room ${roomId} selected`);
    // Handle room selection (e.g., update state or navigate)
  };

  return (
    <Modal
      visible={openModal}
      animationType="slide"
      transparent={false}
      onRequestClose={toggleModal}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex flex-row justify-between bg-primary p-6">
          <View className="flex flex-row gap-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="items-start justify-center ml-4"
            >
              <Image
                source={require("@/assets/icons/arrowWhite.png")}
                className=" w-8 h-8"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View className="items-center justify-center gap-1">
              <Text className="font-bold text-lg text-neutrals">{title}</Text>
              <Text className="font-bold text-lg text-neutrals">
                Du {moment(dates.checkInDate).format("ddd DD MMM")}- Au{" "}
                {moment(dates.checkOutDate).format("ddd DD MMM")}
              </Text>
            </View>
          </View>
          <View className="items-end justify-center">
            <TouchableOpacity onPress={() => router.push("/searchResultsPage")}>
              <Image
                source={require("@/assets/icons/shareIconWhite.png")}
                className=" w-8 h-8"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView className="mt-2">
          {/* Modal Title */}
          <View className="p-4">
            <View>
              {renderContent ? (
                renderContent()
              ) : (
                <View>
                  <FlatList
                    scrollEnabled={false}
                    data={data}
                    keyExtractor={(item) => item.roomId.toString()}
                    renderItem={({ item }) => {
                      return (
                        <RoomCard room={item} onSelectRoom={handleSelectRoom} />
                      );
                    }}
                  />
                </View>
              )}
            </View>

            {/* Render Custom Footer (if provided) */}
            {renderFooter && <View className="mt-4">{renderFooter()}</View>}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default FullScreenModal;
