//server side processing
"use-server";

import {registerUser} from "../api/auth";
const handelRegister=async(fromData:any)=>{
    try{
        //handle data from component file
        const result= await registerUser(fromData);
        //handke how to send data back to component
        if(result.success){
            return{
                success:true,
                message:"Registration successful",
                data:result.data
            };

            
        }

        return{
            success:false,
            message:result.message || "Registraiton failed"
        }
    } catch (err: Error | any){
        return{
            success:false,
            message: err.message || "Regisatration failed"
        }
    }
}