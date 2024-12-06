import axios, { AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create({
    baseURL: process.env.BACKEND_API,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    }
});

instance.interceptors.response.use(
    (response) => response,
    (err) => {
        const error = err?.response?.data?.error;
        const status = error?.status;
        const message = error?.message;
        const errorObject = {
            status: status || 500,
            message: message || 'Internal server error'
        };

        return Promise.reject(errorObject);
    }
);

export default instance;