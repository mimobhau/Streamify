import mongoose from "mongoose"

const friendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    /**
     * "sender: {..}" -- field
     * "type: mongoose.Schema.Types.ObjectId" -- value of 'sender' will be an ObjectId, which references another document
     * "ref: "User"" -- this objectId refers to a document in the USer collection
     */
    
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted"],
        default: "pending"
    }
},
{
    timestamps: true
})

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema)

export default FriendRequest