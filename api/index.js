import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectionDB from "./database/connection.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";
import paymentRoute from "./routes/payment.routes.js";
import bodyParser from "body-parser";

//configurations
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
dotenv.config();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

//connection to DB
connectionDB();

//routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoute);

app.listen(4000, () => {
  console.log(`Server Started`);
});
