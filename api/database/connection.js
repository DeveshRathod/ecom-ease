import mongoose from "mongoose";

const connectionDB = () =>
  mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to DB");
  });

export default connectionDB;
