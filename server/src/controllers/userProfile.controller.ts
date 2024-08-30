import { db, auth } from "../../firebaseConfig";
import { Request, Response } from "express";
import { UserProfile } from "../typesDeclaration/types";
import bcryptjs from "bcryptjs";

// Implement the createUserProfile function to create a new user profile in Firestore Database.
const createUserProfile = async (req: Request, res: Response) => {
  try {
    //    { const userProfile: UserProfile = req.body;}
    const { firstName, surName, email, password, phoneNumber } =
      req.body as UserProfile;
    // Validate required fields
    if (!firstName || !surName || !email || !password || !phoneNumber) {
      return res.status(400).json({
        status: "failed",
        message:
          "verifiez les informations obligatoires: firstName, surName, email, password, or phoneNumber.",
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
    const existingUser = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({
        status: "failed",
        message: "Email is already in use.",
      });
    }
    // Combine firstName and surName to create a displayName
    const displayName = `${firstName} ${surName}`;
    const userCredential = await auth.createUser({
      email,
      password,
      phoneNumber,
      displayName,
    });
    console.log(userCredential.uid);
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
      favoriteProperties: [],
    });

    const searchHistoryRef = userRef.collection("searchHistory");
    await searchHistoryRef.doc().set({
      searches: [],
    });
    const favoritePropertiesRef = userRef.collection("favoriteProperties");
    await favoritePropertiesRef.doc().set({
      favoris: [],
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

export default createUserProfile;
