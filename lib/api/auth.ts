//backend api call only 
import axiosInstance from "./axios";
import axios from "./axios";
import { API } from "./endpoints";

export const registerUser= async(registerData: any)=>{
    try{
        const response= await axiosInstance.post(
            API.USER.RESGISTER, //BACKEND route path
            registerData
        );
        return response.data;
    }catch(err: Error | any){
        throw new Error
        {
            err.response?.data?.message 
            || err.message 
            || "Registration failed"
        };
    }
}



