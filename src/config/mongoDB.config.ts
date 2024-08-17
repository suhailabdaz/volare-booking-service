import mongoose from "mongoose";
import "dotenv/config";


const connectDB = async () => {
    try {
      console.log("keri");
      const mongoURI = `${process.env.MONGO_URI}${process.env.MONGODB_NAME}`;
      const conn = await mongoose.connect(
        `${process.env.MONGO_URI}${process.env.MONGODB_NAME}`
      );    
      console.log(`BookingDB-connected: ${conn.connection.host}`);
    } catch (error: any) {
      console.log(error.message);
      process.exit(1);
    }
  };
  
  export { connectDB };