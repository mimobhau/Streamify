import mongoose from "mongoose"

export const connectDB = async() => {
// 'async' allows us to use "await" inside the function
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        /**
         *  ".connect()" method is used to coonect to MongoDB
         *  "mongoose.connect()" returns a "Promise" that resolves to a connection object when successful
         *  "process.env.MONGO_URI" gets the connection string
         */
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error in connecting to MongoDB", error)
        process.exit(1);
        // failure_code = 1
    }
}