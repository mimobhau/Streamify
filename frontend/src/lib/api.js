import { axiosInstance } from "./axios"

export const signup = async (signupData) => {
    // Send signup data to the server
    const response = await axiosInstance.post("/auth/signup", signupData)
    return response.data
}

export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me")
        // 'axios.get' is used to make a GET request to '/auth/me
        return res.data
    } catch (error) {
        console.log("Error in getAuthUser: ", error)
        return null
    }
}

export const completeOnboarding = async (userData) => {
    const response = await axiosInstance.post("/auth/onboarding", userData)
    return response.data
}
/**
 * 'completeOnboarding' - accepts one argument 'userData'
 * 'sends a POST request to '/auth/onboarding' with the user data
 * 'returns the response data from the server'
 */

export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData)
    return response.data
}

export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout")
    return response.data
}

// gets 'friends' list
export async function getUserFriends() {
    const response = await axiosInstance.get("/users/friends")
    return response.data
}

// gets 'recommended users' list
export async function getRecommendedUsers() {
    const response = await axiosInstance.get("/users")
    return response.data
}

// to track the outgoing friend-requests
export async function getOutgoingFriendReqs() {
    const response = await axiosInstance.get("/users/outgoing-friend-request")
    return response.data
}

// to send friend-request with id == 'userId'
// it is a 'POST' request and it makes changes
export async function sendFriendRequest(userId) {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`)
    return response.data
}

// to fetch the sent/received friend requests
export async function getFriendRequests() {
    const response = await axiosInstance.get("/users/friend-requests")
    return response.data
}

// to modify/put the friends list, when a friend-request is accepted
export async function acceptFriendRequest(requestId) {
    const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`)
    return response.data
}

// for real-time chat
export async function getStreamToken() {
    const response = await axiosInstance.get("/chat/token")
    return response.data
}