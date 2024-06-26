import mongoose from "mongoose";

const connectionDB = () => {
  mongoose.connect(process.env.MONGO).then(() => {
    console.log("DB connected");
  });
};

export default connectionDB;
