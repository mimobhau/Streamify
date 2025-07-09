import {StreamChat} from "stream-chat"
import "dotenv/config"
/*  replacement of "import dotenv from "dotenv"; dotenv.config()"   */

const apiKey = process.env.STEAM_API_KEY
const apiSecret = process.env.STEAM_API_SECRET

if(!apiKey || !apiSecret)
    console.error("Stream API key or Secret is missing.")

const streamClient = StreamChat.getInstance(apiKey, apiSecret)
// with "StreamClient" we can interact/communicate with the Stream app

export const upsertStreamUser = async (userData) => {
    try {
        if(!userData?.id || typeof userData.id !== "string")
            throw new Error(`Invalid userData.id: ${userData?.id}`)

        const userArray = [
            {
                id: userData.id,
                name: userData.name,
                image: userData.image || ""
            }
        ]
        console.log("Final formatted user payload: ", userArray)

        await streamClient.upsertUsers(userArray)
        // " .upsertUsers(...) " is a method that updates the "userdata", if not present then it creates one
        /**
         * .upsertUsers() expects an object where 'keys are userIDs' and values are the 'user data'
         */
        return userData
    } catch (error) {
        console.error("Error upserting Stream user: ", error)
    }
}

// export const generateStreamToken = {userID} => {}