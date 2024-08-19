import {View, Text, Image, ImageURISource} from "react-native"

type IconProps = {
  icon: ImageURISource[];
  color: string;
  name: string;
  focused: boolean;
};

export function TabBarIcon({ icon, color, name, focused }: IconProps) {
  return <View className="flex flex-col items-center">
    
    <Image source={icon} resizeMode="contain" tintColor={color} className="w-6 h-6"/>
    <Text className={`text-xs text-center ${focused ? 'text-primary-600' : 'text-neutrals-neutrals-n900'}`}>{name}</Text>
  </View>;
}
