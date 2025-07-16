import axios from "axios"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api"

export const axiosInstance = axios.create({
    baseURL: BASE_URL,           // so that we dont have to write the baseURL in every request
    withCredentials: true       // to send cookies with the requests
})