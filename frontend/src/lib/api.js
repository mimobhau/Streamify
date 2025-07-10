import { axiosInstance } from "./axios"

export const signup = async (signupData) => {
    // Send signup data to the server
    const response = await axiosInstance.post("/auth/signup", signupData)
    return response.data
}