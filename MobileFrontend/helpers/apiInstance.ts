import axios, { AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create({
    baseURL: 'http://192.168.1.131:4000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

instance.interceptors.response.use(
    (response) => response,
    (err) => {
        console.log(err);
        const error = err?.response?.data?.error || { 
            message: 'Api error.', 
            status: 500, 
            timestamp: Date.now(), 
        };
        
        return Promise.reject(error);
    }
);

export default instance;
