import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api",           // so that we dont have to write the baseURL in every request
    withCredentials: true       // to send cookies with the requests
})