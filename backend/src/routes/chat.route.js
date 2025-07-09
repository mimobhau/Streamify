import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getStreamToken } from "../controllers/chat.controller.js"

const router = express.Router()

// to generate a 'string token' for the user to access the chat service through Stream; making it more protected
router.get("/token", protectRoute, getStreamToken)

export default router