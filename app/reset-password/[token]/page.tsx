"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage(){

  const { token } = useParams();
  const router = useRouter();

  const [password,setPassword] = useState("");
  const [message,setMessage] = useState("");

  const submit = async (e:any)=>{

    e.preventDefault();

    try{

      const res = await fetch("http://localhost:5050/api/auth/reset-password",{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body: JSON.stringify({
          token,
          password
        })

      });

      const data = await res.json();

      setMessage(data.message);

      setTimeout(()=>{
        router.push("/login");
      },2000)

    }
    catch(err){
      setMessage("Something went wrong");
    }

  };

  return(

    <div className="min-h-screen flex items-center justify-center bg-white">

      <form onSubmit={submit} className="bg-white shadow-md p-8 rounded-xl w-96">

        <h1 className="text-2xl font-bold mb-4">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="border p-3 w-full rounded-lg mb-4"
        />

        <button
          type="submit"
          className="bg-green-600 text-white w-full p-3 rounded-lg"
        >
          Reset Password
        </button>

        {message && (
          <p className="mt-4 text-green-600 text-sm">
            {message}
          </p>
        )}

      </form>

    </div>

  )

}