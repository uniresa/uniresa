import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userProfileRouter from "./routes/userProfile.route";
dotenv.config();

const port = process.env.OUT_PORT || 3500;

// exposedHeaders: ['set-cookie'];

//  app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(
//   cors({
//     credentials: true,
//     origin: 'https://www.yannickdjoa.org',
//   })
// );
const app = express();
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // Allow requests from known origins or any origin during development
      const allowedOrigins = [
        "http://localhost:8081", // Replace with your Expo development URL
        "exp://192.168.1.181:8081", // Replace with your actual IP address if using a physical device
        "http://localhost:8080",
        "http://192.168.1.181:8080", // Loopback IP
        "http://uniresa.expo.dev",
      ];

      // Allow requests if origin is in the allowed list or if no origin (e.g., Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/userProfile", userProfileRouter);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
