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

// export interface Property {
//   id: string;
//   name: string;
//   propertyImage: string;
//   rating: number;
//   address: string;
//   oldPrice: number;
//   newPrice: number;
//   latitude: string;
//   longitude: string;
//   photos: Photo[];
//   rooms: Room[];
//   registrationDate: string;
//   distanceToPoint: string;
//   propertyType: string;
//   reviews: number;
//   reviewsRating: number;
//   description?: string;
// }

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
  isRequired?: boolean;
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
  classNameLocal?: string;
  classNameTitle?: string;
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
  title?: string;
  firstName: string;
  surName: string;
  email: string;
  password: string;
  phoneNumber: string;
  avatarUrl?: string;
  bio?: string;
  birthDate?: string;
  address?: Address;
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
  userId: string;
  bookingPerson: BookingPerson;
  coTravellersNames?: string[];
  propertyId: string;
  propertyName: string;
  propertyType:
    | "Hotel"
    | "Bungalow"
    | "Furnished Apartment"
    | "Furnished House"
    | "Villa"
    | "Cottage"
    | "Guesthouse"
    | "Hostel"
    | "Resort";
  specificRoomTypeIds: string[];
  numberOfRooms: number;
  bookingDates: BookingDates;
  totalAmount: number;
  travellers?: number;
  currency: string;
  bookingType: "owner" | "uniresaBlock" | "T-Block" | "customer" | "other";
  bookingChannel?: string;
  bookingStatus: "Confirmed" | "Cancelled" | "Completed" | "Pending";
  paymentStatus: "Paid" | "Pending" | "Failed";
  specialRequests?: string[]; // Any specific requests made during booking
  createdAt?: Date;
  updatedAt?: Date;
}

interface BookingDates {
  checkInDate: string;
  checkOutDate: string;
}
//interface for the person making the booking request

interface BookingPerson {
  title?: string;
  firstName: string;
  surName: string;
  email: string;
  phoneNumber: string;
  birthDate?: string;
  address: Address;
}
//address interface
interface Address {
  street?: string;
  quartier?: string;
  city: string;
  district?: string;
  region?: string;
  postalCode?: string;
  country: string;
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
    | "Bungalow"
    | "Furnished Apartment"
    | "Furnished House"
    | "Villa"
    | "Cottage"
    | "Guesthouse"
    | "Hostel"
    | "Resort";
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

export interface AccommodationProperty {
  propertyId: string;
  propertyName: string;
  propertyType:
    | "Hotel"
    | "Bungalow"
    | "Furnished Apartment"
    | "Furnished House"
    | "Villa"
    | "Cottage"
    | "Guesthouse"
    | "Hostel"
    | "Resort";
  tagMessage: string;
  description: string;
  location: LocationDetails;
  images: string[];
  amenities: Amenity[];
  policies: Policies; // Policies related to the property
  checkInDetails: CheckInDetails;
  priceDetails: PriceDetails;
  additionalCost: string;
  additionalInfo: string;
  additionalServices: string;
  finalCleaning: FinalCleaning;
  numberOfStars: number; // stars (1-5 scale)
  reviews?: Review[];
  numberOfReviews: number;
  reviewsRating: number;
  propertyAvailabilities: AvailabilityDetails[]; // Availability details by date range
  roomTypes: RoomType[];
  distanceFromCityCenter?: number;
  distanceFromSea?: number;
  popularFacilities?: string[]; // Popular facilities like "Free Wi-Fi", "Swimming Pool", etc.
  hostDetails?: HostDetails;
  nearbyAttractions?: NearbyAttraction[];
  healthAndSafetyMeasures?: HealthAndSafetyMeasures;
  cancellationPolicy: string;
  keyCollection?: KeyCollection;
  propertyBookings?: BookingDetails[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscountDetails {
  discountId: string;
  discountPercentage?: number;
  discountAmount?: number;
  startDate: Date;
  endDate: Date;
  discountType: "percentage" | "fixed"; // Type of discount ("percentage" or "fixed")
  isActive: boolean; // Is the discount active or not
  createdAt: Date;
  updatedAt: Date;
  bookings?: BookingDetails[];
}

export interface LocationDetails {
  street?: string;
  quartier?: string; // Specific area within a city
  city: string;
  district?: string;
  region?: string;
  postalCode?: string;
  country: string;
  latitude: number; // Geographical latitude
  longitude: number; // Geographical longitude
}

// export interface ImageDetails {
//   url: string; // Image URL
//   description?: string; // Optional description of the image
// }

export interface Amenities {
  freeWiFi: boolean;
  parking: boolean;
  swimmingPool: boolean;
  airConditioning: boolean;
  kitchen: boolean;
  privateBathroom: boolean;
  balcony: boolean;
  petFriendly: boolean;
  breakfastIncluded: boolean;
  gym: boolean;
  laundryService: boolean;
  [key: string]: boolean; // Allows for additional amenities
}
export interface Amenity {
  amenityName: string;
  amenityId: string;
  amenityDescription: string;
  isAvailable: boolean;
  isPopular: boolean;
}

export interface Policies {
  isSmokingAllowed: boolean;
  isPetsAllowed: boolean;
  childrenAllowed: boolean;
  additionalPolicies?: string;
}

export interface CheckInDetails {
  checkIn: string;
  checkOut: string;
  checkInInfo: string;
  propertyAccesDetails: string;
  paymentMethods: string;
  pets: string;
}

export interface PriceDetails {
  currency: string;
  pricePerNight: number;
  taxesAndFeesIncluded?: boolean; // Whether taxes and fees are included in the price
  taxesAndFees?: number;
  discount?: DiscountDetails;
}

export interface Review {
  reviewId: string;
  bookingId: string;
  propertyId: string;
  reviewerName: string;
  rating: number; // 1-5 scale
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
  // Additional review details (e.g., photos, amenities mentioned, etc.)
  bookingDetails?: BookingDetails; // Additional details related to the booking, if applicable
  bookingDetailsId?: string; // Additional details related to the booking, if applicable
}

export interface AvailabilityDetails {
  startDate: string; // Start date of the availability or booking period
  endDate: string; // End date of the availability or booking period
  isAvailable: boolean; // Indicates if the property is available during this period
  bookingId?: string; // Optional: The ID of a booking if the property is booked
  notes?: string; // Optional: Additional notes or reasons for unavailability
}

export interface RoomType {
  reduce(arg0: (acc: any, room: any) => any, arg1: number): unknown;
  roomId: string;
  type: string; // Example: "Double Room", "Suite", etc.
  surface: number; // surface
  capacity: number; // Number of people the room can accommodate
  priceDetails: PriceDetails;
  roomAvailabilities: AvailabilityDetails[]; // Availability details by date range
  discountList: DiscountDetails[];
  ongoingDiscountPercentages: number[];
  isRefundable: boolean;
  amenities: Amenity[];
  roomImages: string[];
  roomBookings?: BookingDetails[];
  roomDescription: string;
  bedType: string;
}

export interface HostDetails {
  hostName: string; // Name of the host or manager
  contactNumber?: string; // Contact phone number
  email?: string;
  hostRating?: number;
  responseRate?: string;
}

export interface NearbyAttraction {
  name: string;
  distance: number;
  type: "Restaurant" | "Museum" | "Park" | "Landmark" | "Shopping Center";
}

export interface HealthAndSafetyMeasures {
  enhancedCleaning: boolean; // Whether enhanced cleaning is practiced
  contactlessCheckIn: boolean; // Whether contactless check-in is available
  handSanitizerAvailable: boolean; // Whether hand sanitizers are available
  [key: string]: boolean | undefined; // Allows for additional health measures
}

export interface FinalCleaning {
  finalCleaningincluded: boolean;
  cleaningFee: number;
  currency?: string;
}

export interface KeyCollection {
  toBeCollectedInProperty: boolean;
  address?: string;
  contactNumber?: string;
  email?: string;
  code?: string;
  keyHolderName?: string;
  details?: string;
}

interface SearchCriteria {
  destination: LocationDetails;
  dates: { checkInDate: string; checkOutDate: string };
  minGuests: number;
  minRooms: number;
  minRating?: number;
  maxPrice?: number;
  minStars?: number;
  amenities?: Amenities;
}

interface UserSearchHistory {
  recentSearch: SearchCriteria | null; // Store the most recent search for the user
  history: SearchCriteria[]; // Store all past searches for the user
}

interface Guests {
  adults: number;
  children: number;
}

interface Query {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  capacity: number;
  rooms: number;
}

interface CountryPickerWrapperProps {
  countryCode?: CountryCode;
  withFlag?: boolean;
  withFilter?: boolean;
  withCallingCode?: boolean;
  withCountryNameButton?: boolean;
  onSelect: (country: any) => void;
  containerButtonStyle?: object;
}
