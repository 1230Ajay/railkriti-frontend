import axios from "axios";

const myInterceptor = axios.create({
    baseURL: process.env.BASE_URL, // Set the base URL
    withCredentials: true, // Enable sending cookies with requests
});

// Example: Add a request interceptor (optional)
myInterceptor.interceptors.request.use(
    (config) => {
        // Modify request configuration if needed
        console.log("Request sent with cookies:", config);
        return config;
    },
    (error) => {
        if (error.response?.status === 403) {
        console.log("user is unauthorised to do that!")
        }
        return Promise.reject(error);
    }
);

// Example: Add a response interceptor (optional)
myInterceptor.interceptors.response.use(
    (response) => {
        // Process the response
        return response;
    },
    (error) => {
        // Handle response errors
        console.error("Error response:", error.response);
        return Promise.reject(error);
    }
);

export default myInterceptor;
