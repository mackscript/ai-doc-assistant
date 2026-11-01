import axios from "axios";


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": undefined,
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
)


api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error.config?.url;

        const isLoginRequest = requestUrl?.includes("/api/auth/login");

        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.replace("/login");

        }

        return Promise.reject(error);
    }
);

export default api