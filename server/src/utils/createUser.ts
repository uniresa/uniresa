import { db, auth } from "../../firebaseConfig";
import { Request, Response } from "express";
import {
  UserProfile,
  BookingDetails,
  SearchHistoryItem,
  AccommodationProperty,
  Transaction,
} from "../typesDeclaration/types";
import bcryptjs from "bcryptjs";

export const createUser = async (userProfile: UserProfile) => {
  const { firstName, surName, email, password, phoneNumber } = userProfile;

  const existingEmail = await db
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (!existingEmail.empty) {
    throw new Error("Email is already in use.");
  }
  // Check if phone number is already in use
  const existingPhone = await db
    .collection("users")
    .where("phoneNumber", "==", phoneNumber)
    .limit(1)
    .get();

  if (!existingPhone.empty) {
    throw new Error("Email is already in use.");
  }

  const displayName = `${firstName} ${surName}`;

  const userCredential = await auth.createUser({
    email,
    password,
    phoneNumber,
    displayName,
  });
  const hashPassword = await bcryptjs.hash(password, 10);
  const userRef = db.collection("users").doc(userCredential.uid);
  await userRef.set({
    ...userProfile,
    userId: userCredential.uid,
    password: hashPassword,
    avatarUrl: null, //set to null until user updates his avatar
    bio: null, // set to null until user updates his bio
    birthDate: null, // set to null until user updates his birth date
    address: {
      street: null,
      quartier: null,
      city: null,
      district: null,
      region: null,
      postalCode: null,
      country: null,
    }, // set to null until user updates each element of his address
    socialLinks: {
      twitter: null, // set to null until user updates his twitter
      facebook: null, // set to null until user updates his facebook
      instagram: null, // set to null until user updates his instagram
      linkedin: null, // set to null until user updates his linkedin
      tiktok: null, // set to null until user updates his tiktok
      youtube: null, // set to null until user updates his youtube
    },
    // password:  hashPassword, // Only store hashed password in Firestore
    emailVerified: false, // Set this to false until the user verifies their email address
    isActive: false, // Set this to false until the user completes their profile
    lastLoginAt: null, // Set this to null until the user logs in for the first time
    createdAt: new Date(),
    updatedAt: new Date(),
    preferredLanguage: "fr",
    preferredCurrency: "Fcfa",
    preferredPaymentMethod: "OM",
    accountBalance: { amount: 0, currency: "Fcfa" },
    loyaltyPoints: 0,
    membershipTier: null,
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false, // Set to false until the user accepts the push notification
    },
    bookingHistory: [],
    searchHistory: [],
    transactionHistory: [],
    favoriteProperties: [],
  });
  const bookingHistoryRef = userRef.collection("bookingHistory");
  const bookings: BookingDetails[] = [];
  await bookingHistoryRef.doc().set({
    Bookings: bookings,
  });
  const searchHistoryRef = userRef.collection("searchHistory");
  const searchHistoryItems: SearchHistoryItem[] = [];
  await searchHistoryRef.doc().set({
    SearchHistoryItems: searchHistoryItems,
  });
  const transactionHistoryRef = userRef.collection("transactionHistory");
  const transactions: Transaction[] = [];
  await transactionHistoryRef.doc().set({
    Transactions: transactions,
  });
  const favoritePropertiesRef = userRef.collection("favoriteProperties");
  const favoriteItems: AccommodationProperty[] = [];
  await favoritePropertiesRef.doc().set({
    FavoriteItems: favoriteItems,
  });
  return userCredential.uid; // Return user ID for further use
};
