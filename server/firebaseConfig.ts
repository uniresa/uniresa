import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import serviceAccount from "./serviceAccount.json";

// Initialize Firebase Admin SDK with Firestore
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

// Initialize Firestore
const db = admin.firestore();

export { admin, db };
