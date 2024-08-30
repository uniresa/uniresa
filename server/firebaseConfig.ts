import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import { getAuth, UserRecord } from "firebase-admin/auth";
import dotenv from "dotenv";
dotenv.config();
import serviceAccount from "./serviceAccountKey.json";
// const serviceAccount = require(process.env.SERVICEACCOUNTPATH as string);

// Initialize Firebase Admin SDK with Firestore
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

// Initialize Firestore
const db = admin.firestore();
const auth = getAuth();

export { admin, db, auth };
