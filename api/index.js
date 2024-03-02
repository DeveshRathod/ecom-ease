import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectionDB from "./database/connection.js";

//configurations
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

//connection to DB
connectionDB();

//routes

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
