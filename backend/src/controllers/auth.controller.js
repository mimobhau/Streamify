import User from "../models/User.js"
import jwt from "jsonwebtoken"
import { upsertStreamUser } from "../lib/stream.js"

export async function signup(req, res)
{
    const {email, password, fullName} = req.body

    try {
        if(!email || !password || !fullName)
            return res.status(400).json({message: "All fields are required."})
        if(password.length < 6)
            return res.status(400).json({message: "Password must be at least 6 characters."})

        // used for checking the format of the given email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
        return res.status(400).json({ message: "Invalid email format." });

        // for checking against 'already exisiting' emails
        const exisitngUser = await User.findOne({email})
        // ".findOne(...)" searches the collection for a single document matching the criteria
        if(exisitngUser)
            return res.status(400).json({message: "Email already exists."})

        // providing a random avatar pic
        const idx = Math.floor(Math.random() * 100) + 1
        /**
         *  generates a number between 1-100
         *  'Math.random()' returns the value between 0-1 (but not 1)
         *  'Math.fllor(..)' rounds down to the nearest integer
         */
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

        // creating the new 'User'
        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar
        })

        // Creating the User in Stream as well
        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || ""
            })
            console.log(`Stream user created for ${newUser.fullName}`)
        } catch (error) {
            console.log("Error creating Stream user: ", error)
        }

        // creating a JWT token (with, field - 'newUser._id')
        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })
        /**
         *  "jwt.sign(...)" creates a 'JSON Web Token' that can be given to the client
         *  {userId: newUser._id} is the payload of the token
         *  "process.env.JWT_SECRET_KEY" is the 'secret key' to sign and later verify the token
         */

        // response
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,        // 1000 - millisecs/sec
            httpOnly: true,
            // makes the cookie inaccessible to Javascript running in the browser
            // prevent XSS attacks
            sameSite: "strict",
            // prevents the browser from sending this cookie in 'cross-site requests'
            // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production"            //prevent HTTP requests
        })

        // sent the response back to the sender
        res.status(201).json({success: true, user: newUser})        //provies the JSON body too

    } catch (error) {
        console.log("Error in signup controller.", error)
        res.status(500).json({message: "Internal Server Error."})
    }
}

export async function login(req, res)
{
    try {
        // providing only 'email' & 'password' for 'Login'
        const {email, password} = req.body

        // checking presence of both email and password
        if(!email || !password)
            return res.status(400).json({message: "All fields are required."})

        // checking if 'email' is correct
        const user = await User.findOne({email})
        if(!user)
            return res.status(401).json({message: "Invalid email or password."})

        // checking if 'password' is correct
        // ".match/password()" - custom methods
        const isPasswordCorrect = await user.matchPassword(password)
        if(!isPasswordCorrect)
            return res.status(401).json({message: "Invalid email or password."})

        // creating a JWT token
        const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        // response
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        // sent response back to the sender
        res.status(200).json({success: true, user})         // 'user' is body being sent

    } catch (error) {
        console.log("Error in Login controller.", error)
        res.status(500).json({message: "Internal Server Error."})
    }
}

export function logout(req, res)
{
    res.clearCookie("jwt")
    // clearing the cookie as user wants to Logout; need to provide the name of the cookie to be cleared (here, "jwt")
    res.status(200).json({success: true, message: "Logout successful"})
}

export async function onboard(req, res)
{
    try {
        // takes the userId from the 'req.user' object, attached by the 'protectRoute
        const userId = req.user._id
        // 'body' required to update the user profile
        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body

        // checks if all the required fields are present (displays the missing fields)
        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location)
        {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean)       //filters the 'falsevalues            
            })
        }

        // UPDATING THE USER PROFILE
        // "findByIdAndUpdate()" - finds a document by its ID and updates it
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...req.body,
                isOnboarded: true
            },
            {new: true}
            /* "findOneAndUpdate()" returns the document as it was before the update was applied.
            setting {new: true} "findOneAndUpdate()" will instead give the object after update was applied. */
        )
        if(!updatedUser)
            return res.status(404).json({message: "User not found."})

        // UPDATING THE USER INFO IN STREAM
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || ""
            })
            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`)
        } catch (streamError) {
            console.log("Error updating Stream user during onboarding: ", streamError.message)
        }

        res.status(200).json({success: true, user: updatedUser})
    } catch(error) {
        console.error("Onboarding error: ", error)
        res.status(500).json({message: "Internal Server Error."})
    }
}