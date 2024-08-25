import { router } from "expo-router";
import { Alert, Image, ImageSourcePropType, Text, View } from "react-native";
import CustomButton from "./CustomButton";

interface OAuthButtonProps {
  oauthIcon: ImageSourcePropType;
  handleOAuth: () => Promise<void>;
  oAuthTitle: string;
}

const OAuth = ({ oauthIcon, oAuthTitle, handleOAuth }: OAuthButtonProps) => {
  return (
    <View>
      <CustomButton
        title={oAuthTitle}
        IconLeft={() => (
          <Image
            source={oauthIcon}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        className="bg-neutrals-20 mb-4 border-2 border-primary py-3 w-full"
        textVariant="primary"
        handlePress={handleOAuth}
      />
    </View>
  );
};

export default OAuth;
