import { View, TouchableOpacity, Text, Image } from "react-native";

interface RadioButtonProps {
  selected: boolean;
  title: string;
  onPress: () => void;
}
const RadioButton: React.FC<RadioButtonProps> = ({
  selected,
  title,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress} className="flex flex-row items-center">
    <View className=" w-full rounded-lg  items-start justify-center">
      {selected ? (
        <View className="flex flex-row justify-between border w-full border-neutrals-60 bg-neutrals-40 p-2">
          <Text className="text-neutrals-900 text-lg font-semibold">
            {title}
          </Text>
          <Image
            source={require("@/assets/icons/greenYesIcon.png")}
            className="w-6 h-6 mx-6"
            resizeMode="contain"
          />
        </View>
      ) : (
        <View className="w-full bg-neutrals-20 p-1 ">
          <Text className="text-primary-600 text-lg">{title}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

//   const [selectedMethod, setSelectedMethod] = useState('bankTransfer');

//   <RadioButton selected={selectedMethod === 'bankTransfer'} onPress={() => setSelectedMethod('bankTransfer')} />
//   <Text>Bank Transfer</Text>

//   <RadioButton selected={selectedMethod === 'paypal'} onPress={() => setSelectedMethod('paypal')} />
//   <Text>PayPal</Text>

export default RadioButton;
