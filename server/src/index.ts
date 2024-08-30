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
app.use(express.json());

app.use("/api/userProfile", userProfileRouter);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
