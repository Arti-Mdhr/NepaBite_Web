import axios from 'axios';
import dotenv from 'dotenv';
import { base64 } from 'zod';

dotenv.config();

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 

const axiosInstance= axios.create({
    baseURL: BASE_URL,
    headers:{
        "Content-type": "application/json"
    }
}

);

export default axiosInstance;