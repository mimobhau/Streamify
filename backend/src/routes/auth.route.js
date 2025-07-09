import express from "express"
import {signup, login, logout, onboard} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
// "/logout" route is a 'POST' request as it will clear the JWT cookie
router.post("/logout", logout)

// as "Onboarding" can only be accessed by 'authenticated' users, we need to protect it (here, using 'protectRoute' middleware)
// 'protectRoute' middleware will verify the user's JWT token, check if the user exists in the database, and attach the user object to the 'req' object
// after validating, it moves on to the 'onboard' controller
router.post("/onboarding", protectRoute, onboard)

// checks if the user is logged in
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({success: true, user: req.user})
})

export default router