import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            process.env.DBURL as string
        )

        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (err) {

        console.error("MongoDB connection failed:", err);
        process.exit(1)
    }
}
export default connectDB;