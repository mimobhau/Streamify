import express from "express"
import dotenv from "dotenv"
// 'dotenv' is a package that loads environment variables from a ".env" file into "process.env"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"

import cors from "cors"

import path from "path"

dotenv.config()
// reads '.env' file, parses all key-value pairs, assigns them to "process.env"

const app = express()
const PORT = process.env.PORT
// "process.env.{variable}"

const __dirname = path.resolve()            //double underscore ("__")

app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // to allow cookies to be sent with requests
}))
app.use(express.json())
// automatically parse the JSON body into a Javascript object, & attach it to "req.body"
app.use(cookieParser())
app.use("/api/auth", authRoutes)
// this "/api/auth" will act as a prefix for all "authRoutes" routes; thus making the code cleaner
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)

if(process.env.NODE_ENV === "production")
{
    // creates a static FRONTEND
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    // if any other routes are typed other than the mentioned ones, return to React app
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
    connectDB();
})

// URL - http://localhost:5001/
// Command - cd backend;
//           npm run dev

// hello