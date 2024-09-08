import { db } from "../../firebaseConfig";
import { Request, Response } from "express";
import { UserProfile } from "../typesDeclaration/types";
import { createUser } from "../utils/createUser";

export const createUserProfile = async (req: Request, res: Response) => {
  try {
    const userProfile = req.body as UserProfile;
    const userId = await createUser(userProfile);
    return res.status(200).json({
      status: "success",
      message: "User Profile created successfully",
      userId,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      status: "failed",
      message: error.message || "Error creating user profile.",
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
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
};
