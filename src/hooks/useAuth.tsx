import { AuthService } from "@/services/auth.service";
import { LoginRequest } from "@/types/login/login.request";
import { useState } from "react";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async (loginRequest: LoginRequest) => {
        setLoading(true);
        setError('');
        try {
            const response = await AuthService.login(loginRequest);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        setLoading(true);
        try {
            await AuthService.logout();
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        login, 
        logout,
        loading,
        error
    }

}