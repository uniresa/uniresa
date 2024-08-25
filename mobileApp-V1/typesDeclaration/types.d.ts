import { TextInputProps } from "react-native";

export interface Photo {
  id: string;
  image: string;
}

export interface Room {
  id: string;
  name: string;
  size: number;
  refundable: string;
  payment: string;
  bed: string;
}

export interface Property {
  id: string;
  name: string;
  propertyImage: string;
  rating: number;
  address: string;
  oldPrice: number;
  newPrice: number;
  latitude: string;
  longitude: string;
  photos: Photo[];
  rooms: Room[];
  registrationDate: string;
  distanceToPoint: string;
  propertyType: string;
  reviews: number;
  reviewsRating: number;
  description?: string;
}

export interface Place {
  id: string;
  place: string;
  placeImage: string;
  shortDescription: string;
  properties: Property[];
}

export interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: any;
  hidePassIcon1?: any;
  hidePassIconStyle1?: string;
  hidePassIcon2?: any;
  hidePassIconStyle2?: string;
  // secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  handlePress?: ((event: GestureResponderEvent) => void) | undefined;
  bgVariant?: "primary" | "secondary" | "warning" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}
