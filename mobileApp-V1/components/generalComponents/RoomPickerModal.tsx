import { RoomType } from "@/typesDeclaration/types";
import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";

interface RoomPickerModalProps {
  isVisible: boolean;
  numberOfRooms: number;
  roomType: RoomType;
  onClose: () => void;
  onConfirm: (numberOfRooms: number) => void;
}

const RoomPickerModal: React.FC<RoomPickerModalProps> = ({
  isVisible,
  numberOfRooms,
  roomType,
  onClose,
  onConfirm,
}) => {
  const [localRooms, setLocalRooms] = useState<number>(numberOfRooms);

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
        }}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {roomType.type}
          </Text>
          <View className="flex flex-row justify-between my-4 text-center">
            <Text className="text-lg font-lbold">nombre d'hebergements</Text>
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

          <Pressable
            onPress={() => onConfirm(localRooms)}
            style={{
              backgroundColor: "#069494",
              padding: 10,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Confirmer
            </Text>
          </Pressable>
          <Pressable onPress={onClose}>
            <Text style={{ textAlign: "center", marginTop: 10 }}>Fermer</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
export default RoomPickerModal;
