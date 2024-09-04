import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { UserProfile } from "@/typesDeclaration/types";

type ProfileCardProps = {
  profile: UserProfile | null;
};

// ProfileCard component to display user's profile information in a card layout.
const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  // Extract the first letters of the first name and family name
  const initials = `${profile?.firstName.charAt(0)}${profile?.surName.charAt(
    0
  )}`;
  return (
    <View className="flex flex-row h-[150px] items-center justify-center bg-primary">
      <View className=" items-center justify-center gap-6">
        <View className=" rounded-full p-3 bg-secondary-100 border-2 border-secondary">
          {profile?.avatarUrl ? (
            <Image
              source={{ uri: profile.avatarUrl }}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <Text className="text-xl text-warning-600 font-lbold">
              {initials.toUpperCase()}
            </Text>
          )}
        </View>
        <Text className="text-neutrals text-xl font-lbold">
          {profile?.firstName} {profile?.surName}
        </Text>
      </View>
      <Pressable className="absolute right-4">
        <Image
          source={require("@/assets/icons/settingOnBg.png")}
          className="w-8 h-8"
        />
      </Pressable>
    </View>
  );
};

export default ProfileCard;
