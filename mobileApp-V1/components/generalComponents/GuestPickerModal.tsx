import { Guests } from "@/typesDeclaration/types";
import React, { useState, useEffect } from "react";
import {
  BottomModal,
  ModalButton,
  ModalContent,
  ModalFooter,
  ModalTitle,
  SlideAnimation,
} from "react-native-modals";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface GuestPickerModalProps {
  isVisible: boolean;
  guests: Guests;
  numberOfRooms: number;
  onClose: () => void;
  onConfirm: (newGuests: Guests, numberOfRooms: number) => void;
}

const GuestPickerModal: React.FC<GuestPickerModalProps> = ({
  isVisible,
  guests,
  numberOfRooms,
  onClose,
  onConfirm,
}) => {
  // Local guests state to manage increment/decrement within the modal
  const [localGuests, setLocalGuests] = useState<Guests>(guests);
  const [localRooms, setLocalRooms] = useState<number>(numberOfRooms);

  // Ensure local guests state is synced with the parent-provided guests when the modal opens
  useEffect(() => {
    setLocalGuests(guests);
  }, [guests, isVisible]);

  const incrementGuests = (type: keyof Guests) => {
    setLocalGuests((prevState) => ({
      ...prevState,
      [type]: prevState[type] + 1,
    }));
  };
  const decrementGuests = (type: keyof Guests) => {
    if (type === "adults" && localGuests.adults > 1) {
      setLocalGuests((prevState) => ({
        ...prevState,
        adults: prevState.adults - 1,
      }));
    } else if (type === "children" && localGuests.children > 0) {
      setLocalGuests((prevState) => ({
        ...prevState,
        children: prevState.children - 1,
      }));
    }
  };

  return (
    <BottomModal
      swipeThreshold={200}
      swipeDirection={["up", "down"]}
      footer={
        <ModalFooter>
          <ModalButton
            text="Confirmer"
            style={{
              marginBottom: 20,
              backgroundColor: "#069494",
              marginRight: 20,
              marginLeft: 20,
              borderRadius: 24,
            }}
            textStyle={{ color: "#ffffff" }}
            onPress={() => onConfirm(localGuests, localRooms)}
          />
        </ModalFooter>
      }
      modalTitle={
        <ModalTitle
          title="Selectionnez les voyageurs et chambres"
          textStyle={{ color: "#333333", fontSize: 20, fontWeight: 700 }}
        />
      }
      modalAnimation={
        new SlideAnimation({
          slideFrom: "bottom",
        })
      }
      visible={isVisible}
      onTouchOutside={onClose}
      //   onBackdropPress={onClose}
    >
      <ModalContent style={{ width: "100%", height: 310 }}>
        {/* Rooms Picker */}
        <View className="flex flex-row justify-between my-4 text-center">
          <Text className="text-lg font-lbold">Chambres</Text>
          <View className="flex flex-row items-center gap-3">
            <Pressable
              onPress={() => setLocalRooms(Math.max(1, localRooms - 1))}
              className="w-7 h-7 rounded-full bg-neutrals-60 justify-center items-center"
            >
              <Text className="text-xl font-bold">-</Text>
            </Pressable>
            <Text>{localRooms}</Text>
            <Pressable
              onPress={() => setLocalRooms((localRooms) => localRooms + 1)}
              className="w-7 h-7 rounded-full bg-neutrals-60 justify-center items-center"
            >
              <Text className="text-xl font-bold">+</Text>
            </Pressable>
          </View>
        </View>

        {/* Adults Picker */}
        <View className="flex flex-row justify-between my-4 text-center">
          <Text className="text-lg font-lbold">Adultes</Text>
          <View className="flex flex-row items-center gap-3">
            <Pressable
              onPress={() => decrementGuests("adults")}
              className="w-7 h-7 rounded-full bg-neutrals-60 justify-center items-center"
            >
              <Text className="text-xl font-bold">-</Text>
            </Pressable>
            <Text>{localGuests.adults}</Text>
            <Pressable
              onPress={() => incrementGuests("adults")}
              className="w-7 h-7 rounded-full bg-neutrals-60 justify-center items-center"
            >
              <Text className="text-xl font-bold">+</Text>
            </Pressable>
          </View>
        </View>

        {/* Children Picker */}
        <View className="flex flex-row justify-between my-4 text-center">
          <Text className="text-lg font-lbold">Enfants</Text>
          <View className="flex flex-row items-center gap-3">
            <Pressable
              onPress={() => decrementGuests("children")}
              className="w-7 h-7 rounded-full bg-neutrals-60 justify-center items-center"
            >
              <Text className="text-xl font-bold">-</Text>
            </Pressable>
            <Text>{localGuests.children}</Text>
            <Pressable
              onPress={() => incrementGuests("children")}
              className="w-7 h-7 rounded-full bg-neutrals-60 justify-center items-center"
            >
              <Text className="text-xl font-bold">+</Text>
            </Pressable>
          </View>
        </View>
      </ModalContent>
    </BottomModal>
  );
};

export default GuestPickerModal;
