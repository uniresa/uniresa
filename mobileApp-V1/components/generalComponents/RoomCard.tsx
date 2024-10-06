import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import React, { useState } from "react";
import { RoomType } from "@/typesDeclaration/types";
import { getAmenityIcon } from "@/utils/amenityIcon";
import { calculateDiscountedPrice } from "@/utils/discountedPriceCalculation";
import { selectSearchCriteria } from "@/redux/slices/searchCriteriaSlice";
import { useSelector } from "react-redux";
import CustomButton from "./CustomButton";

const { width } = Dimensions.get("window");

interface RoomCardProps {
  room: RoomType;
  onSelectRoom: (roomId: string, roomTotalPrice: number) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onSelectRoom }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current image index
  const { dates } = useSelector(selectSearchCriteria);

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: any } };
  }) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width); // Update the current index based on scroll position
    setCurrentIndex(index);
  };
  // Convert check-in and check-out strings to Date objects
  const checkInDate = new Date(dates.checkInDate);
  const checkOutDate = new Date(dates.checkOutDate);
  // Calculate the number of nights
  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  const nights = Math.round(
    Math.abs((checkOutDate.getTime() - checkInDate.getTime()) / oneDay)
  );
  // Calculate total price (with or without discount)
  const discountedPricePerNight = calculateDiscountedPrice(room.priceDetails);
  const totalDiscountedPrice = discountedPricePerNight * nights;
  const totalStandardPrice = room.priceDetails.pricePerNight * nights;

  const roomTotalPrice = room.priceDetails.discount
    ? totalDiscountedPrice
    : totalStandardPrice;

  return (
    <View className="rounded-3xl border-2 border-neutrals-300 my-4">
      {/* Room Images */}
      <View className="flex flex-row w-full justify-between rounded-t-3xl overflow-hidden">
        {room.roomImages.length > 0 ? (
          <FlatList
            data={room.roomImages}
            keyExtractor={(item, index) => index.toString()}
            onScroll={handleScroll}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {}}>
                <ImageBackground
                  source={{ uri: item, cache: "force-cache" }}
                  style={{
                    height: 200,
                    width: width,
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text>No images available</Text>
        )}
        {/* Custom Image Indicator */}
        <View className="absolute left-0 right-0 bottom-2 flex-row justify-center">
          <View className="flex-row space-x-2">
            {room.roomImages.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 16,
                  width: 16,
                  borderRadius: 10,
                  backgroundColor:
                    currentIndex === index ? "#FFA500" : "#D3D3D3",
                  marginHorizontal: 2,
                }}
              />
            ))}
          </View>
        </View>
        <View className="absolute right-0 bottom-0 bg-neutrals-800 p-2">
          <Text className="text-base text-neutrals">
            {room.roomImages.length} photos
          </Text>
        </View>
      </View>

      {/* Room Details */}
      <View className="m-4">
        <Text className="text-xl text-neutrals-800 font-bold mb-2">
          {room.type}
        </Text>
        <View className="flex flex-row gap-2 items-center">
          <Image
            source={require("@/assets/icons/personWithKid.png")}
            className=" w-6 h-6"
            resizeMode="contain"
          />
          <Text className="text-lg text-neutrals-800 font-lregular">
            {room.capacity} personnes
          </Text>
        </View>
        <View className="flex flex-row gap-2 items-center">
          <Image
            source={require("@/assets/icons/bedOnBg.png")}
            className=" w-6 h-6"
            resizeMode="contain"
          />
          <Text className="text-lg text-neutrals-800 font-lregular">
            {room.bedType}
          </Text>
        </View>
        <View className="flex flex-row gap-2 items-center">
          <Image
            source={require("@/assets/icons/surface.png")}
            className=" w-6 h-6"
            resizeMode="contain"
          />
          <Text className="text-lg text-neutrals-800 font-lregular">
            {room.surface} m² de superficie
          </Text>
        </View>

        {/* Amenities */}
        <View className="flex flex-col justify-between ">
          {room.amenities
            .filter((amenity) => amenity.isAvailable)
            .slice(0, 6)
            .map((amenity, index) => {
              const icon = getAmenityIcon(amenity.amenityId);
              return (
                <View
                  key={index}
                  className="flex flex-row mb-2 items-center gap-2"
                >
                  {icon && (
                    <Image
                      source={icon}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />
                  )}
                  <Text className="text-neutrals-800 text-xl">
                    {amenity.amenityName}
                  </Text>
                </View>
              );
            })}
        </View>
      </View>
      <View className="border-t-2 border-neutrals-60"></View>
      {/* Price Section */}
      <View className="m-4 ">
        <Text className="text-xl text-neutrals-800 font-lregular">
          Tarif pour {nights} nuits
        </Text>
        {room.priceDetails.discount ? (
          <View className="flex flex-row gap-3">
            <Text className="text-lg text-accents-400 font-lregular line-through">
              {room.priceDetails.currency}{" "}
              {(room.priceDetails.pricePerNight * nights).toFixed(0)}
            </Text>
            <Text className="text-xl text-neutrals-800 font-bold">
              {room.priceDetails.currency} {totalDiscountedPrice.toFixed(0)}
            </Text>
          </View>
        ) : (
          <Text className="text-xl text-neutrals-800 font-bold">
            {room.priceDetails.currency}
            {(room.priceDetails.pricePerNight * nights).toFixed(0)}
          </Text>
        )}
      </View>
      <View className="m-4">
        <CustomButton
          title="Choisir cette chambre"
          classNameTitle="text-xl font-bold"
          handlePress={() => onSelectRoom(room.roomId, roomTotalPrice)}
        />
      </View>
    </View>
  );
};

export default RoomCard;
