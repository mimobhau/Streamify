import express from "express"
import {signup, login, logout, onboard} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

// as "Onboarding" can only be accessed by 'authenticated' users, we need to protect it (here, using 'protectRoute' middleware)
router.post("/onboarding", protectRoute, onboard)

// checks if the user is logged in
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({success: true, user: req.user})
})

export default router