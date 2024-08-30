import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.OUT_PORT || 8080;


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

app.get("/", (req, res) => {
  res.send("Hello, World! ts");
});
app.get("/hi", (req, res) => {
  res.send("Hello, World! I have all necessary things to do");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
