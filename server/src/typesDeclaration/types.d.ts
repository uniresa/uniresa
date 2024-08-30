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
  propertyType:
    | "Hotel"
    | "Apartment"
    | "House"
    | "treeHouse"
    | "Bungalow"
    | "Chalet"
    | "TerreBattue";
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
  favoriteProperties: string[]; // List of property IDs that the user has marked as favorite

  //Search
  searchHistory: SearchHistoryItem[]; // An array of SearchHistoryItem

  // Account Status
  emailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
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
