import mongoose from "mongoose";


// connect to mongoDb database

const connectDB = async ()=>{
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

    mongoose.connection.on('connected', ()=> console.log('Database connected successfully!')
    )

    try {
        await mongoose.connect(`${mongoUri}/Edemy`, { serverSelectionTimeoutMS: 5000 })
    } catch (error) {
        throw new Error(
            `Could not connect to MongoDB at ${mongoUri}/Edemy. Start MongoDB locally or set MONGODB_URI in server/.env. Original error: ${error.message}`
        )
    }

}
export default connectDB;
