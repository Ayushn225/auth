import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const dburi = process.env.MONGO_URI;

export async function connectDB() {

	if (!dburi) {
        console.error("❌ Error: MONGO_URI is not defined in your environment variables!");
        process.exit(1); 
    }

	try {
        await mongoose.connect(dburi);
        console.log("🍃 Connected to MongoDB successfully.");
    } catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1);
    }

}
