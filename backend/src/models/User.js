import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    // fields....
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    bio: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default: ""
    },
    nativeLanguage: {
        type: String,
        default: ""
    },
    learningLanguage: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    // a special field (required)
    isOnboarded: {
        type: Boolean,
        default: false
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {timestamps:true})
// "timestamps: true" allows us with these function - createdAt, updatedAt
// ex- member of the group is 'createdAt/updatedAt'


// pre-hook (for hashing passwords)
userSchema.pre("save", async function(next) {
    /**
     *  " .pre("save", ...) " registers 'pres-save' middleware
     *  which means this function runs before a User document is saved to the database
 *  "async function(next)" declares an async middleware function that receives "next" (a callback)
    */
   if(!this.isModified("password"))    return next()
    /* If the password field has NOT been modified, skip the hasing logic and just continue saving. */

try {
    const salt = await bcrypt.genSalt(10)
    // generates salt with 10 rounds of processing
    this.password = await bcrypt.hash(this.password, salt)
    // here, "this..." is the 'user'; so "this.password" = 'users's password'
    
    next()
    // tells mongoose that we are done with this middleware, so it can proceed with saving the document
} catch (error) {
    next(error)
    // passes the error to mongoose
    // which stops saving the document & return the error
}
})

 userSchema.methods.matchPassword = async function(enteredPassword)
/**
 *  compares the entered password with the already present 'hashed' password during "Login"
 *  " .methods " object lets us add 'custom instance methods' to the model
 *  these methods can be called on 'individual documents' (here, specific user)
 *  "user" document will now have a ".matchPassword()" method that can be called
*/
{
    const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password)
    return isPasswordCorrect
}

const User = mongoose.model("User", userSchema)
// creating a model - "User"; with the above mentioned schema (userSchema)

export default User

/*
 Why "await" is only used with "async" function !!!
 Ans>
        "async function" always returns a Promise;
        "await" tells Javascript to 'pause' until the Promise is resolved
*/