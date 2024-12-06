import axios, { AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_API,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    }
});

instance.interceptors.response.use(
    (response) => response,
    (err) => {
        const { status } = err.response;
        const { message } = err.response.data;
        
        return Promise.reject({ status: status, message: message });
    }
);

export default instance;