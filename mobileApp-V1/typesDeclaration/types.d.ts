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
export interface Profile {
  // id: string;
  firstName: string;
  surName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
  bio?: string;
  birthDate?: Date;
  address?: {
    street: string;
    quartier: string;
    city: string;
    subRegion: string;
    region: string;
    country: string;
  };
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId?: string;
  firstName: string;
  surName: string;

  email: string;
  password: string;
  phoneNumber: string;
  avatarUrl?: string;
  bio?: string;
  birthDate?: Date;
  address?: {
    street: string;
    quartier: string;
    city: string;
    district: string;
    region: string;
    postalCode?: string;
    country: string;
  };
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
  };
  preferredCurrency?: string; // Example: "USD", "EUR"
  preferredLanguage?: string; // Example: "en", "fr"
  preferredPaymentMethod?: string; //"Credit Card", "MoMo", "OM"
  accountBalance?: { amount: number; currency: string };

  // Booking History
  bookingHistory?: BookingDetails[];

  // Loyalty and Rewards
  loyaltyPoints?: number; // Optional field for loyalty program points
  membershipTier?: "Silver" | "Gold" | "Platinum";

  // Notifications and Alerts
  notificationPreferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
  // Favorites
  favoriteProperties?: Property[]; // List of property IDs that the user has marked as favorite

  //Search
  searchHistory?: SearchHistoryItem[]; // An array of SearchHistoryItem

  // Transaction History
  transactionHistory?: Transaction[];

  // credit cards list
  creditCards?: CreditCard[];

  // Account Status
  emailVerified?: boolean;
  isActive?: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BookingDetails {
  bookingId: string;
  propertyName: string;
  propertyType:
    | "Hotel"
    | "Apartment"
    | "House"
    | "treeHouse"
    | "Bungalow"
    | "Chalet"
    | "TerreBattue";
  roomType?: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalAmount: number;
  currency: string;
  bookingStatus: "Confirmed" | "Cancelled" | "Completed" | "Pending";
  paymentStatus: "Paid" | "Pending" | "Failed";
  specialRequests?: string[]; // Any specific requests made during booking
}
// Interface for Search History Item
interface SearchHistoryItem {
  searchId: string;
  place: string; //reflect the destination of the search
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  numberOfRooms: number;
  propertyType?:
    | "Hotel"
    | "Apartment"
    | "House"
    | "treeHouse"
    | "Bungalow"
    | "Chalet"
    | "TerreBattue";
  filtersApplied?: { [key: string]: string | number }; // Optional filters (e.g., price range, amenities)
  location: string; // Place where the search was made
  searchDate: Date; // Date and time when the search was made
}

interface CreditCard {
  // Credit
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

interface Transaction {
  transactionId: string;
  type: "Deposit" | "Withdrawal" | "Payment";
  amount: number;
  currency: string;
  date: Date;
  description?: string;
  // Transaction Details
  transactionDetails?: TransactionDetails[];
}

interface TransactionDetails {
  transactionDetailId: string;
  bookingId?: string;
  propertyId?: string;
  bookingDetailsId?: string;
  amount: number;
  currency: string;
  date: Date;
  description?: string;
  // Payment Details
  paymentDetails?: PaymentDetails[];
}

interface PaymentDetails {
  paymentDetailId: string;
  paymentMethod: "Credit Card" | "MoMo" | "OM";
  paymentStatus: "Paid" | "Failed";
  paymentDate: Date;
  paymentReference?: string;
  // Payment Method Details
  paymentMethodDetails?: PaymentMethodDetails[];
}

interface PaymentMethodDetails {
  paymentMethodDetailId: string;
  paymentMethod: "Credit Card" | "MoMo" | "OM";
  cardNumber?: string;
  expirationDate?: string;
  cvv?: string;
  // Payment Method Specific Details (e.g., for MoMo, transactionId, etc.)
  paymentMethodSpecificDetails?: PaymentMethodSpecificDetails[];
}

interface PaymentMethodSpecificDetails {
  paymentMethodSpecificDetailId: string;
  paymentMethod: "MoMo";
  transactionId: string;
  // MoMo Specific Details (e.g., transactionId, status, etc.)
  moMoSpecificDetails?: MoMoSpecificDetails[];
}
