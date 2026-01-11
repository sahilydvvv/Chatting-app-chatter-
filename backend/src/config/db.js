import mongoose from "mongoose"

export const connectDB = async ()=>{
    try {
        const mongoURI = process.env.MONGO_URI
        if(!mongoURI){
            throw new Error("Please provide MONGO_URI in the environment variables")
        }
        const conn = await mongoose.connect(mongoURI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error connecting to mongodb",error);
        process.exit(1)
    }
}