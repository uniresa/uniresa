
import express, { Express, Request, Response } from "express";
const port = 8000;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World! ts");
});
app.get("/hi", (req, res) => {
  res.send("Hello, World! I have all necessary things to do");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
