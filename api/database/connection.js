import mongoose from "mongoose";

const connectionDB = () => {
  try {
    mongoose.connect(process.env.MONGO).then(() => {
      console.log("DB connected");
    });
  } catch (error) {
    console.log("Error connecting to MongoDB");
  }
};

export default connectionDB;
