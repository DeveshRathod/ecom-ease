import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectionDB from "./database/connection.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";

//configurations
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

//connection to DB
connectionDB();

//routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

app.listen(4000, () => {
  console.log(`Server Started`);
});
