import React, { ReactNode, useState } from "react";
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
import CustomButton from "./CustomButton";
import {
  AccommodationProperty,
  RoomType,
  SelectedRoom,
} from "@/typesDeclaration/types";

interface FullScreenModalProps {
  toggleModal: () => void; // Function to toggle the modal visibility
  openModal: boolean; // Boolean to control modal visibility
  title?: string; // Optional title for the modal, default provided in the component
  data: Array<any>;
  property: AccommodationProperty;
  renderContent?: () => ReactNode; // Optional function to render custom content
  renderFooter?: () => ReactNode; // Optional function to render footer (e.g., actions or buttons)
}

// FullScreenModal Component with TypeScript
const FullScreenModal: React.FC<FullScreenModalProps> = ({
  toggleModal,
  openModal,
  title = "Belle hotel",
  data = [],
  property,
  renderContent,
  renderFooter,
}) => {
  const { dates } = useSelector(selectSearchCriteria);
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);

  const handleSelectRoom = (
    roomId: string,
    roomTotalPrice: number,
    roomName: string
  ) => {
    console.log(
      `Room ${roomName} with iD ${roomId} selected with total price: ${roomTotalPrice}`
    );

    setSelectedRooms((prevSelectedRooms) => {
      // Check if room is already selected
      const isRoomSelected = prevSelectedRooms.some(
        (room) => room.roomId === roomId
      );

      if (isRoomSelected) {
        // If room is already selected, remove it
        return prevSelectedRooms.filter((room) => room.roomId !== roomId);
      } else {
        // Add the room with its total price
        return [...prevSelectedRooms, { roomId, roomTotalPrice, roomName }];
      }
    });
  };

  const reservationTotalPrice = selectedRooms.reduce(
    (acc, room) => acc + room.roomTotalPrice,
    0
  );
  const handleReserve = () => {
    // Navigate to the reservation confirmation page or payment screen
    if (selectedRooms.length > 0) {
      router.push({
        pathname: "/(screens)/bookingPersonForm",
        // as Href<"/bookingPersonForm">
        params: {
          reservationTotalPrice: reservationTotalPrice,
          checkInDate: dates.checkInDate,
          checkOutDate: dates.checkOutDate,
          selectedRooms: JSON.stringify(selectedRooms),
          property: JSON.stringify(property),
        },
      });
    } else {
      alert("Veuillez séléctionner au moins un chambre pour réserver");
      return;
    }
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
        {/* Fixed Footer */}
        <View className="mx-4 my-4">
          <View className="my-2">
            <Text className="text-xl text-neutrals-900 font-bold">
              {reservationTotalPrice.toLocaleString("fr-FR", {
                style: "currency",
                currency: "XAF",
              })}{" "}
              Pour {""}
              {selectedRooms.length > 1
                ? `${selectedRooms.length} hebergements`
                : `${selectedRooms.length} hebergement`}
            </Text>

            <Text className="text-lg text-neutrals-800">
              Taxes et frais compris
            </Text>
          </View>
          <CustomButton
            title="Reserver"
            classNameTitle=""
            classNameLocal=""
            handlePress={handleReserve}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default FullScreenModal;
