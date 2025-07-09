import axios from "axios";
import { getSession } from "next-auth/react";
import https from "https"
// Create the axios instance
const myInterceptor = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized:false
    }),
    baseURL: process.env.BASE_URL, // Set the base URL from environment variables
});

// Example: Add a request interceptor to include JWT token in headers
myInterceptor.interceptors.request.use(
    async (config) => {
        // Get the session using getSession
        const session = await getSession();
        
        if (session?.accessToken) {
            // Add the JWT token from the session to the Authorization header
            config.headers['Authorization'] = `Bearer ${session.accessToken}`;
        }

        return config;
    },
    (error) => {
        if (error.response?.status === 403) {
            console.log("User is unauthorized to do that!");
        }
        return Promise.reject(error);
    }
);

// Example: Add a response interceptor
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
