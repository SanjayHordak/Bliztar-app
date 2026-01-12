import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    withCredentials:true, //by adding this line we ensure that cookies are 
                          //sent to server automatically,on every request
});

export default axiosInstance;
