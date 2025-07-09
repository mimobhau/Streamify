import User from "../models/User.js"
import FriendRequest from "../models/FriendRequest.js"

export async function getRecommendedUsers(req, res) {
    try {
        // extracts the current user's Id & user object from the request
        const currentUserId = req.user.id
        const currentUser = req.user
        const recommendedUsers = await User.find({
            $and: [
                {_id: { $ne: currentUserId}},       //exclude current user
                {_id: { $nin: currentUser.friends}},        //exclude current user's friends
                {isOnboarded: true}
            ]
        })
        /**
         * $and: "logical AND" -- all conditions must be true
         * $ne: "not equal" -- doesn't return the user themselves
         * $nin: "not in" -- exclude all users who are already in the user's 'friends' list
         */

        res.status(200).json(recommendedUsers)

    } catch (error) {
        console.error("Error in getRecommendedUsers controller: ", error.message)
        res.status(500).json({message: "Internal Server Error."})
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "fullName profilePic nativeLanguage learningLanguage")
        /**
         * 'findById(req.user.id)' - get the current user's document from database
         * '.select("friends")' - only retrieve the 'friends' field
         * '.populate(...)' - replace the ObjectIds in 'friends' with full user documents
         *                      (such as, fullName. pofilePic....)
         */
        res.status(200).json(user.friends)
    } catch (error) {
        console.error("Error in getMyFriends controller", error.message)
        res.status(500).json({message: "Internal Server Error."})
    }
}

export async function sendFriendRequest(req, res) {
    try {
        // getting my(user's) id & recipient's id from the api-request
        const myId = req.user.id
        const {id: recipientId} = req.params        // 'id' renamed with 'recipientId'

        // preventing sending friend-request to myself
        if(myID === recipientId)
            return res.status(400).json({message: "You cannot send friend request to yourself."})

        const recipient = await User.findById(recipientId)
        if(!recipient)
            return res.status(404).json({message: "Recipient Not Found."})

        // checking if the user is already friends with the recipient
        if(recipient.friends.includes(myId))
            return res.status(400).json({message: "You are already friends with this user."})

        // checking if a request already exists
        const exisitngREquest = await FriendRequest.findOne({
            $or: [
                {sender: myId, recipient: recipientId},
                {sender: recipientId, recipient: myId}
            ]
        })
        /**
         * " $or: " -- checks if either of the conditions are true
         */

        if(existingRequest)
            return res
                .status(400)
                .json({message: "A friend-request already exists within between you and this user."})

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        })

        res.status(201).json(friendRequest)
    } catch (error) {
        console.error("error in sendFriendRequest controller", error.message)
        res.status(500).json({message: "Internal Server Error."})
    }
}

export async function acceptFriendRequest(req, res){
    try {
        // getting the requestId from the api-request
        // 'req.params' contains the parameters from the URL
        // gets the friend-request from the 'FriendRequest' schema
        const {id: requestId} = req.params
        const friendRequest = await FriendRequest.findById(requestId)

        if(!friendRequest)
            return res.status(404).json({message:"Friend-request not found."})

        // verifying the current user is the recipient
        if(friendRequest.recipient.toString() !== req.user.id)
            return res.status(403).json({message: "You are not authorised to accept htis request."})

        friendRequest.status = "accepted"
        await friendRequest.save()

        // adding each user to the other's friends array
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: {friends: friendRequest.recipient}
        })
        /**
         *  ".findByIdAndUpdate(...)" -- finds the user by their Id & updates ther 'friends' list
         *  "friendRequest.sender" -- the Id of the user who sent the friend request
         *  "$addToSet: {...}" -- adds an value to an array only if it doesn't already exist; avoids duplicates
         * "recipient" is added to the 'friend' list of the "sender"
         */

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: {friends: friendRequest.recipient}
        }) 

        res.status(200).json({message: "Friend Request Accepted."})
    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}

export async function getFriendRequests(req, res) {
    try {
        // for INCOMING friend-requests from OTHERS to the current user
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage")
        /**
         * 'find(...)' -- finds all friend-requests where the recipient is the current user
         * 'status: "pending"' -- only retrieves requests that are still pending
         * '.populate(...)' -- replaces the ObjectId of the sender with their full user document
        */
       
       // for ACCEPTED friend-requests from the current user to OTHERS
         const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted"
        }).populate("recipient", "fullName profilePic")
        /**f f
         * 'status: "accepted"' -- only retrieves requests that have been accepted
         * '.populate(...)' -- replaces the ObjectId of the recipient with their full user document
         */

        res.status(200).json({incomingReqs, acceptedReqs})
    } catch (error) {
        console.log("Error in getPendingFriendRequests controller", error.message)
        res.status(500).json({message: "Internal Server Error."})
    }
}

export async function getOutgoingFriendReqs(req, res) {
// to show the already sent, yet pending friend requests
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage")

        res.status(200).json(outgoingRequests)
    } catch (error) {
        console.log("Error in getOutgoingFriendReqs controller", error.message)
        res.status(500).json({message: "Internal Server Error."})
    }
}