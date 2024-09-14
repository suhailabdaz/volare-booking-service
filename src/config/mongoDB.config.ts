import mongoose from "mongoose";
import "dotenv/config";


const connectDB = async () => {
    try {
      const conn = await mongoose.connect(
        `${process.env.BOOKING_MONGO_URI}${process.env.BOOKING_MONGODB_NAME}`
      );    
      console.log(`BookingDB-connected: ${conn.connection.host}`);
    } catch (error: any) {
      console.log(error.message);
      process.exit(1);
    }
  };
  
  export { connectDB };