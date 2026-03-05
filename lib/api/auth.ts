import { apiFetch } from "@/lib/api";

export const registerUser = async (registerData: any) => {
  return await apiFetch("/api/auth/register", {
    method: "POST",
    body: registerData,  
  });
};