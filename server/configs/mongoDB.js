import mongoose from "mongoose";

const connectDB = async () => {

    try {

        mongoose.connection.on('connected', () => {
            console.log("✅ DB connnected");
        })
        await mongoose.connect(`${process.env.MONGODB_URL}/Cluster0`)
    } catch (error) {
        process.exit(1)
    }

}

export default connectDB