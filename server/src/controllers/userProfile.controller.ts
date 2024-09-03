import { db, auth } from "../../firebaseConfig";
import { Request, Response } from "express";
import {
  UserProfile,
  BookingDetails,
  SearchHistoryItem,
  Property,
} from "../typesDeclaration/types";
import bcryptjs from "bcryptjs";

export const createUserProfile = async (req: Request, res: Response) => {

  try {
    const { firstName, surName, email, password, phoneNumber } =
      req.body as UserProfile;
    if (!firstName || !surName || !email || !password || !phoneNumber) {
      return res.status(400).json({
        status: "failed",
        message:
          "verifiez les informations obligatoires: prenom, nom, email, mot de passe, ou le numero de telephone",
      });
    }

    // if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
    //   return res.status(400).json({
    //     status: 'failed',
    //     message:
    //       'The phone number must be contain the country code in format (+1)',
    //   });
    // }
    // Check if email is already in use
    const existingEmail = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingEmail.empty) {
      return res.status(400).json({
        status: "failed",
        message: "Email is already in use.",
      });
    }
    // Check if phone number is already in use
    const existingPhone = await db
      .collection("users")
      .where("phoneNumber", "==", phoneNumber)
      .limit(1)
      .get();

    if (!existingPhone.empty) {
      return res.status(400).json({
        status: "failed",
        message: "Phone number is already in use.",
      });
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
      firstName,
      surName,
      email,
      phoneNumber,
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
      loyaltyPoints: 0,
      membershipTier: null,
      notificationPreferences: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: false, // Set to false until the user accepts the push notification
      },
      bookingHistory: [],
      searchHistory: [],
      favoriteProperties: [],
    });

    const searchHistoryRef = userRef.collection("searchHistory");
    const searchHistoryItems: SearchHistoryItem[] = [];
    await searchHistoryRef.doc().set({
      SearchHistoryItems: searchHistoryItems,
    });

    const favoritePropertiesRef = userRef.collection("favoriteProperties");
    const favoriteItems: Property[] = [];
    await favoritePropertiesRef.doc().set({
      FavoriteItems: favoriteItems,
    });
    const bookingHistoryRef = userRef.collection("bookingHistory");
    const bookings: BookingDetails[] = []; // Set to an empty array until the user makes a booking.
    await bookingHistoryRef.doc().set({
      Bookings: bookings,
    });

    return res.status(200).json({
      status: "success",
      message: "User Profile created successfully",
      //   user: { userId: userCredential.uid, email },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      status: "failed",
      message: "Error creating user profile.",
      error,
    });
  }
};


export const getUserProfile= async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
    const user = userDoc.data() as UserProfile;
    return res.status(200).json({
      status: "success",
      user,
    });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({
        status: "failed",
        message: "Error fetching user profile.",
        error,
      });
    }

}
