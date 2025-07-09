import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendReqs } from "../controllers/user.controller.js"

const router = express.Router()

// applying "protectRoute" middleware to all routes in this Router
router.use(protectRoute)

// provides all the API's related to users
router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)

router.post("/friend-request/:id", sendFriendRequest)
router.put("/friend-request/:id/accept", acceptFriendRequest)

router.get("/friend-requests", getFriendRequests)
// to show the already sent, yet pending friend requests
router.get("/outgoing-friend-request", getOutgoingFriendReqs)

export default router