import axios from "axios"

const axiosInstance = axios.create({
    withCredentials: true,
    // baseURL: `https://backend.bmscephaseshift.in`
    baseURL: `http://localhost:8000`
})

export default axiosInstance;