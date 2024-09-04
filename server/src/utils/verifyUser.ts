import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";

// Middleware to verify the Firebase ID Token
const verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const auth = getAuth();

  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No Firebase token provided" });
  }

  try {
    // Verify the Firebase ID Token
    const decodedToken = await auth.verifyIdToken(token);
    console.log("Decoded Token:", decodedToken);

    // Attach the decoded token (user info) to the request object
    (req as any).user = decodedToken;

    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid Firebase token" });
  }
};

export default verifyUser;
