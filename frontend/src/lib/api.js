import { axiosInstance } from "./axios"

export const signup = async (signupData) => {
    // Send signup data to the server
    const response = await axiosInstance.post("/auth/signup", signupData)
    return response.data
}

export const getAuthUser = async () => {
    const res = await axiosInstance.get("/auth/me")
    // 'axios.get' is used to make a GET request to '/auth/me
    return res.data
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