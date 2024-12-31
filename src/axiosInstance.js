import axios from "axios"

const axiosInstance = axios.create({
    withCredentials: true,
    // baseURL: `http://localhost:8000`
    // baseURL: import.meta.env.VITE_BACKEND_URL
    baseURL: `/api/`
})

export default axiosInstance;