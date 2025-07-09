import jwt from "jsonwebtoken"
import User from "../models/User.js"

/** "protectRoute" middleware
 * 
 *  verifies the user's JWT token
 *  checks if the user exists in the database
 *  attaches the user object to the 'req' object
 *  blocks access to the route if the user is not authenticated
 */
export const protectRoute = async(req, res, next) => {
// 'next()' is required as it is a middleware
    try {
        // extracts the JWT token from the cookies sent by the browser
        const token = req.cookies.jwt
        if(!token)
            return res.status(401).json({message: "Unauthorised - No token provided."})

        // verifies the JWT token using the secret key from .env
        // if valid, returns the decoded payload (here, userId)
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!decoded)
            return res.status(401).json({message: "Unauthorised - User Not Found."})

        // uses the 'userId' from the decoded token to find the user in the database
        // '.select("-password") excludes the password field from the result for safety
        const user = await User.findById(decoded.userId).select("-password")
        if(!user)
            return res.status(401).json({message: "Unauthorised - User Not Found."})

        // attaches the found user object to the request (req.user)
        // so downstream route handlers/controllers can access the current user
        req.user = user
        next()

    } catch (error) {
        console.log("Error in protectRoute middleware", error)
        res.status(500).json({message: "Internal Server Error."})
    }
}